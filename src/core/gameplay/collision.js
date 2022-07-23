// Collision Function
function withinBounds(object1, object2, offset=1) { // Standard Collision
  if((object1.x+object1.width/offset > object2.x)                 &&
     (object1.x+object1.width/offset < object2.x+object2.width)   &&
     (object1.y+object1.height/offset > object2.y)                &&
     (object1.y+object1.height/offset < object2.y+object2.height)) {
      return true;
  } else { return false; }
}

export { withinBounds };