import { useState, useEffect, useCallback } from 'react';
import { getExperts } from '../services/api';
import ExpertCard from '../components/ExpertCard';
import SearchFilter from '../components/SearchFilter';
import Pagination from '../components/Pagination';
import { SkeletonCard } from '../components/Loader';
import { FiUsers, FiAlertCircle } from 'react-icons/fi';
import './ExpertListing.css';

const ExpertListing = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const LIMIT = 6;

  const fetchExperts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: LIMIT };
      if (search.trim()) params.search = search.trim();
      if (category) params.category = category;

      const result = await getExperts(params);
      setExperts(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load experts');
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchExperts();
    }, search ? 400 : 0);

    return () => clearTimeout(debounce);
  }, [fetchExperts]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, category]);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="listing-header animate-fade-in-up">
          <div className="listing-header-text">
            <h1 className="listing-title">
              Find Your Expert
            </h1>
            <p className="listing-subtitle">
              Book sessions with top professionals across various domains
            </p>
          </div>
          {pagination.total > 0 && (
            <div className="listing-count">
              <FiUsers size={16} />
              <span>{pagination.total} expert{pagination.total !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        <SearchFilter
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
        />

        {loading ? (
          <div className="experts-grid">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="error-state" id="error-state">
            <FiAlertCircle size={48} />
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchExperts}>
              Try Again
            </button>
          </div>
        ) : experts.length === 0 ? (
          <div className="empty-state" id="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No experts found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="experts-grid" id="experts-grid">
              {experts.map((expert, index) => (
                <ExpertCard key={expert._id} expert={expert} index={index} />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={pagination.pages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ExpertListing;
