import { FiSearch, FiFilter } from 'react-icons/fi';
import './SearchFilter.css';

const CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Cloud Architecture',
  'DevOps',
  'UI/UX Design',
  'Project Management',
];

const SearchFilter = ({ search, onSearchChange, category, onCategoryChange }) => {
  return (
    <div className="search-filter" id="search-filter">
      <div className="search-box">
        <FiSearch className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Search experts by name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
          id="search-input"
        />
      </div>

      <div className="filter-box">
        <FiFilter className="filter-icon" size={16} />
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="filter-select"
          id="category-filter"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchFilter;
