import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import Image from '../../../components/AppImage';

interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpfulCount: number;
  images?: string[];
}

interface CustomerReviewsProps {
  reviews: Review[];
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({ reviews }) => {
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  const [showAllReviews, setShowAllReviews] = useState(false);

  const getWidthClass = (percentage: number) => {
    if (percentage >= 90) return 'w-full';
    if (percentage >= 80) return 'w-11/12';
    if (percentage >= 75) return 'w-3/4';
    if (percentage >= 70) return 'w-8/12';
    if (percentage >= 60) return 'w-3/5';
    if (percentage >= 50) return 'w-1/2';
    if (percentage >= 40) return 'w-2/5';
    if (percentage >= 30) return 'w-1/3';
    if (percentage >= 25) return 'w-1/4';
    if (percentage >= 20) return 'w-1/5';
    if (percentage >= 10) return 'w-1/12';
    return percentage > 0 ? 'w-1' : 'w-0';
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest', label: 'Highest Rating' },
    { value: 'lowest', label: 'Lowest Rating' },
    { value: 'helpful', label: 'Most Helpful' }
  ];

  const ratingFilterOptions = [
    { value: 'all', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' }
  ];

  // derive aggregates from reviews prop
  const totalReviews = reviews?.length || 0;
  const averageRating = totalReviews
    ? Number((reviews.reduce((s, r) => s + (r.rating || 0), 0) / totalReviews).toFixed(1))
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews?.filter((r) => Math.round(r.rating) === stars).length || 0
  }));

  const ratingDistribution = ratingCounts.map((r) => ({
    stars: r.stars,
    count: r.count,
    percentage: totalReviews ? Math.round((r.count / totalReviews) * 100) : 0
  }));

  // apply rating filter
  const filteredByRating = filterRating === 'all'
    ? reviews
    : reviews?.filter((r) => Math.round(r.rating) === Number(filterRating));

  // apply sorting
  const sorted = [...(filteredByRating || [])].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return (b.helpfulCount || 0) - (a.helpfulCount || 0);
      case 'newest':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const displayedReviews = showAllReviews ? sorted : sorted?.slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-lg p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">Customer Reviews</h2>
      {/* Rating Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
            <span className="text-4xl font-bold text-foreground">{averageRating}</span>
            <div className="flex items-center space-x-1">
              {[...Array(5)]?.map((_, i) => (
                <Icon
                  key={i}
                  name="Star"
                  size={20}
                  className={i < Math.floor(averageRating) ? 'text-accent fill-current' : 'text-muted-foreground'}
                />
              ))}
            </div>
          </div>
          <p className="text-muted-foreground">Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
        </div>

        <div className="space-y-2">
          {ratingDistribution?.map((rating) => (
            <div key={rating?.stars} className="flex items-center space-x-3">
              <span className="text-sm font-medium w-6">{rating?.stars}</span>
              <Icon name="Star" size={14} className="text-accent fill-current" />
              <div className="flex-1 bg-muted rounded-full h-2 relative overflow-hidden">
                <div
                  className={`bg-accent h-full rounded-full transition-all duration-300 ${getWidthClass(rating?.percentage || 0)}`}
                />
              </div>
              <span className="text-sm text-muted-foreground w-8">{rating?.count}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-foreground mb-2">Sort by</label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Select sort option" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-foreground mb-2">Filter by rating</label>
          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger>
              <SelectValue placeholder="Select rating filter" />
            </SelectTrigger>
            <SelectContent>
              {ratingFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Reviews List */}
      <div className="space-y-6">
        {displayedReviews?.map((review) => (
          <div key={review?.id} className="border-b border-border pb-6 last:border-b-0">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={review?.avatar}
                  alt={review?.author}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">{review?.author}</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)]?.map((_, i) => (
                          <Icon
                            key={i}
                            name="Star"
                            size={14}
                            className={i < review?.rating ? 'text-accent fill-current' : 'text-muted-foreground'}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review?.date)}
                      </span>
                    </div>
                  </div>
                  {review?.verified && (
                    <div className="flex items-center space-x-1 text-success">
                      <Icon name="CheckCircle" size={16} />
                      <span className="text-sm font-medium">Verified Purchase</span>
                    </div>
                  )}
                </div>

                <h5 className="font-medium text-foreground mb-2">{review?.title}</h5>
                <p className="text-muted-foreground mb-3 leading-relaxed">{review?.content}</p>

                {review?.images && review?.images?.length > 0 && (
                  <div className="flex space-x-2 mb-3">
                    {review?.images?.map((image, index) => (
                      <div key={index} className="w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center space-x-4 text-sm">
                  <button className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-hover">
                    <Icon name="ThumbsUp" size={14} />
                    <span>Helpful ({review?.helpfulCount})</span>
                  </button>
                  <button className="text-muted-foreground hover:text-foreground transition-hover">
                    Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Show More Button */}
      {reviews?.length > 3 && (
        <div className="text-center mt-6">
          <Button
            variant="outline"
            onClick={() => setShowAllReviews(!showAllReviews)}
          >
            {showAllReviews ? 'Show Less Reviews' : `Show All ${reviews?.length} Reviews`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;
