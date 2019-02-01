/* global THREE */

const UPWARD_DEFORM_BIAS = 16 //bias deformation direction slightly upwards
const MAX_AFFECTED_DISTANCE_FROM_CONTACT_POINT = 7 * 7 //Vertices greater than this distance from a contact point are unaffected.  Stored squared as an optimization
const MAX_DEFORMATION = 2.3 //Max distance a vertex moves in one deform call
const DEFORMATION_STRENGTH = 0.04 //Scalar strength applied to deformVector
const NOISE = 0.1 //Each vertex calculation is scaled by a random amount, +- noise value


const applyNoise = vector => {
  vector.x *= (1 - NOISE) + 2*Math.random()*NOISE
  vector.y *= (1 - NOISE) + 2*Math.random()*NOISE
  vector.z *= (1 - NOISE) + 2*Math.random()*NOISE
}

const calculateVertexDeformation = ( deformVector, distanceToContactPoint ) => {
  const distanceFalloff = 1 - 0.5 * ( distanceToContactPoint / MAX_AFFECTED_DISTANCE_FROM_CONTACT_POINT ) //as distance goes from 0 to max, falloff drops from 1 to 0.5

  return new THREE.Vector3()
    .copy( deformVector ) //Start with deformVector
    .multiplyScalar(-DEFORMATION_STRENGTH) //Negate the direction and scale based on strength
    .clampLength(0, MAX_DEFORMATION) //Clamp to max deformation
    .multiplyScalar(distanceFalloff) //After clamp, scale based on distance from contact point
}

export const deform = ( $rootObject, contactPoints, deformVector ) => {

  deformVector.y -= UPWARD_DEFORM_BIAS //Apply bias
  contactPoints = contactPoints.map( p => new THREE.Vector3(p[0], p[1], p[2])) //Turn raw arrays into vector objects
  
  $rootObject.traverse( object => {
    
    const { geometry } = object
    if ( geometry && geometry.type !== 'BoxGeometry' ) { //Ignore BoxGeometry children, which are probably just PhysiJS collision volumes

      //Iterate over all vertices
      for ( let i = 0; i < geometry.attributes.position.count; i ++ ) {
        
        //Transform vertex position to world space, to compare against contact point
        const vertexWorldPos = object.localToWorld(new THREE.Vector3(
          geometry.attributes.position.getX(i),
          geometry.attributes.position.getY(i),
          geometry.attributes.position.getZ(i),
        ))

        const closestDistance = Math.min( ...contactPoints.map(cp => vertexWorldPos.distanceToSquared( cp )))
        
        if ( closestDistance <= MAX_AFFECTED_DISTANCE_FROM_CONTACT_POINT ) {
          const vertexDeformation = calculateVertexDeformation( deformVector, closestDistance)
          applyNoise( vertexDeformation )

          //Apply deformation to vertex, transform back to local space, save changes back to BufferGeometry
          vertexWorldPos.add(vertexDeformation)
          const vertexLocalPos = object.worldToLocal(vertexWorldPos)
          geometry.attributes.position.setXYZ(i, vertexLocalPos.x, vertexLocalPos.y, vertexLocalPos.z)
        }

        
      }

      geometry.attributes.position.needsUpdate = true
    }
  })
}