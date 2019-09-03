export function searchTree(element, _id){
    if(element._id == _id){
         return element;
    }else if (element.children != null){
         var i;
         var result = null;
         for(i=0; result == null && i < element.children.length; i++){
              result = searchTree(element.children[i], _id);
         }
         return result;
    }
    return null;
}