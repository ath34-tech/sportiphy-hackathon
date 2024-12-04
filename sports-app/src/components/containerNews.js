
import React from "react";
function NewsComponent({data}) {
    const keys = Object.keys(data); // Get all the keys (location names)
    return (
      <div>
     {data.map(item=>(
        console.log(item[Object.keys(item)[0]])
        // console.log(item['Champions League'])
     ))}
      </div>
    );
  }
  
  export default NewsComponent;