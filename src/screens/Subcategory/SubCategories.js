import React from 'react'
import { useParams } from 'react-router-dom'
function SubCategories() {
  const { id } = useParams();
  return (
    <div>
      Subcategory {id}
    </div>
  )
}

export default SubCategories
