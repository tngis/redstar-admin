import React from 'react';
import { useParams } from 'react-router-dom'

function SectorDetailScreen() {
  const { id } = useParams();
  return (
    <div>
      Hello {id}
    </div>
  )
}

export default SectorDetailScreen
