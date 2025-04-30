import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"

function StarRating({ rating }) {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />)
  }


  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half-star" className="text-yellow-400" />)
  }


  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />)
  }

  return (
    <div className="flex items-center">
      {stars}
      <span className="ml-2 text-gray-600">{rating.toFixed(1)}</span>
    </div>
  )
}

export default StarRating
