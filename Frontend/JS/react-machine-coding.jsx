"use client"
/* eslint-disable react-hooks/static-components */
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// =====================================================================================
// 1. OUTSIDE-CLICK DROPDOWN
// =====================================================================================
// A dropdown menu that closes when the user clicks outside of it

// Custom Hook for detecting outside clicks
function useOutsideClick(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, callback]);
}

export function OutsideClickDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useOutsideClick(dropdownRef, () => setIsOpen(false));

  const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setIsOpen(!isOpen)}>
        Select Option {isOpen ? '▲' : '▼'}
      </button>
      
      {isOpen && (
        <ul style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          listStyle: 'none',
          padding: '8px 0',
          margin: 0,
          background: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          minWidth: '150px',
          zIndex: 1000
        }}>
          {options.map((option, index) => (
            <li 
              key={index}
              onClick={() => {
                console.log('Selected:', option);
                setIsOpen(false);
              }}
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


// =====================================================================================
// 2. DYNAMIC REACT FORM (from JSON)
// =====================================================================================
// Render form fields based on JSON config with conditional rendering and validation

const formConfig = {
  fields: [
    { name: 'fullName', type: 'text', label: 'Full Name', required: true },
    { name: 'email', type: 'email', label: 'Email', required: true, pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' },
    { name: 'phone', type: 'tel', label: 'Phone', pattern: '^\\d{10}$' },
    { name: 'userType', type: 'select', label: 'User Type', options: ['individual', 'business'], required: true },
    { name: 'companyName', type: 'text', label: 'Company Name', showIf: { field: 'userType', value: 'business' }, required: true },
    { name: 'employeeCount', type: 'number', label: 'Number of Employees', showIf: { field: 'userType', value: 'business' } },
    { name: 'subscribe', type: 'checkbox', label: 'Subscribe to newsletter' },
    { name: 'comments', type: 'textarea', label: 'Comments', rows: 4 }
  ]
};

export function DynamicForm({ config = formConfig }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Check if field should be visible based on conditional logic
  const shouldShowField = (field) => {
    if (!field.showIf) return true;
    return formData[field.showIf.field] === field.showIf.value;
  };

  // Validate a single field
  const validateField = (field, value) => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return `${field.label} is required`;
    }
    if (field.pattern && value) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(value)) {
        return `${field.label} format is invalid`;
      }
    }
    return null;
  };

  // Handle input change
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field.name]: value }));
    
    if (touched[field.name]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field.name]: error }));
    }
  };

  // Handle blur for touched state
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field.name]: true }));
    const error = validateField(field, formData[field.name]);
    setErrors(prev => ({ ...prev, [field.name]: error }));
  };

  // Validate all fields
  const validateAll = () => {
    const newErrors = {};
    config.fields.forEach(field => {
      if (shouldShowField(field)) {
        const error = validateField(field, formData[field.name]);
        if (error) newErrors[field.name] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateAll()) {
      console.log('Form submitted:', formData);
      alert('Form submitted successfully!');
    }
  };

  // Render field based on type
  const renderField = (field) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: formData[field.name] || '',
      onChange: (e) => handleChange(field, e.target.type === 'checkbox' ? e.target.checked : e.target.value),
      onBlur: () => handleBlur(field),
      style: { width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }
    };

    switch (field.type) {
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Select...</option>
            {field.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case 'textarea':
        return <textarea {...commonProps} rows={field.rows || 3} />;
      case 'checkbox':
        return (
          <input 
            type="checkbox"
            id={field.name}
            name={field.name}
            checked={formData[field.name] || false}
            onChange={(e) => handleChange(field, e.target.checked)}
            style={{ marginRight: '8px' }}
          />
        );
      default:
        return <input type={field.type} {...commonProps} />;
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
      {config.fields.map(field => (

        shouldShowField(field) && (
          <div key={field.name} style={{ marginBottom: '16px' }}>
            <label htmlFor={field.name} style={{ display: 'block', fontWeight: 'bold' }}>
              {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
            </label>
            {renderField(field)}
            {errors[field.name] && (
              <span style={{ color: 'red', fontSize: '12px' }}>{errors[field.name]}</span>
            )}
          </div>
        )
      ))}
      <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Submit
      </button>
    </form>
  );
}


// =====================================================================================
// 3. CONTACT FORM SUBMISSION
// =====================================================================================
// Feedback/contact form that submits to a back-end API

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format';
    if (!formData.message.trim()) return 'Message is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const error = validateForm();
    if (error) {
      setStatus({ type: 'error', message: error });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      // Replace with your actual API endpoint
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to submit');

      setStatus({ type: 'success', message: 'Thank you! Your message has been sent.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginTop: '4px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box'
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Contact Us</h2>
      
      {status.message && (
        <div style={{
          padding: '12px',
          marginBottom: '16px',
          borderRadius: '4px',
          background: status.type === 'error' ? '#fee2e2' : '#dcfce7',
          color: status.type === 'error' ? '#dc2626' : '#16a34a'
        }}>
          {status.message}
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="name">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="subject">Subject</label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="message">Message *</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          style={inputStyle}
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        style={{
          padding: '12px 24px',
          background: isSubmitting ? '#ccc' : '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isSubmitting ? 'not-allowed' : 'pointer'
        }}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}


// =====================================================================================
// 4. PAGINATED DATA TABLE
// =====================================================================================
// Users table with pagination controls

export function PaginatedDataTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Using JSONPlaceholder - in real app, API would support pagination
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const allUsers = await response.json();
      
      // Client-side pagination (in real app, server would handle this)
      const total = Math.ceil(allUsers.length / pageSize);
      setTotalPages(total);
      
      const start = (currentPage - 1) * pageSize;
      const paginatedUsers = allUsers.slice(start, start + pageSize);
      setUsers(paginatedUsers);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Users</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #e5e7eb' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #e5e7eb' }}>Name</th>
            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #e5e7eb' }}>Email</th>
            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #e5e7eb' }}>Company</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td style={{ padding: '12px', border: '1px solid #e5e7eb' }}>{user.id}</td>
              <td style={{ padding: '12px', border: '1px solid #e5e7eb' }}>{user.name}</td>
              <td style={{ padding: '12px', border: '1px solid #e5e7eb' }}>{user.email}</td>
              <td style={{ padding: '12px', border: '1px solid #e5e7eb' }}>{user.company?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
        <button 
          onClick={() => goToPage(1)} 
          disabled={currentPage === 1}
          style={{ padding: '8px 12px' }}
        >
          First
        </button>
        <button 
          onClick={() => goToPage(currentPage - 1)} 
          disabled={currentPage === 1}
          style={{ padding: '8px 12px' }}
        >
          Previous
        </button>
        
        {/* Page numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            style={{
              padding: '8px 12px',
              background: currentPage === page ? '#2563eb' : 'white',
              color: currentPage === page ? 'white' : 'black'
            }}
          >
            {page}
          </button>
        ))}
        
        <button 
          onClick={() => goToPage(currentPage + 1)} 
          disabled={currentPage === totalPages}
          style={{ padding: '8px 12px' }}
        >
          Next
        </button>
        <button 
          onClick={() => goToPage(totalPages)} 
          disabled={currentPage === totalPages}
          style={{ padding: '8px 12px' }}
        >
          Last
        </button>
      </div>
      
      <p style={{ textAlign: 'center', marginTop: '8px', color: '#6b7280' }}>
        Page {currentPage} of {totalPages}
      </p>
    </div>
  );
}


// =====================================================================================
// 5. INFINITE SCROLL LIST
// =====================================================================================
// Load more content as user scrolls down

export function InfiniteScrollList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  // Fetch posts from API
  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
      );
      const newPosts = await response.json();
      
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setItems(prev => [...prev, ...newPosts]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  // Initial load
  useEffect(() => {
    fetchPosts();
  }, []); // Only on mount

  // Setup Intersection Observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchPosts();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchPosts, hasMore, loading]);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Infinite Scroll Posts</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {items.map((item, index) => (
          <div 
            key={`${item.id}-${index}`}
            style={{
              padding: '16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              background: '#fff'
            }}
          >
            <h3 style={{ margin: '0 0 8px 0' }}>{item.title}</h3>
            <p style={{ margin: 0, color: '#6b7280' }}>{item.body}</p>
          </div>
        ))}
      </div>

      {/* Loading indicator / sentinel element */}
      <div ref={loadMoreRef} style={{ padding: '20px', textAlign: 'center' }}>
        {loading && <span>Loading more...</span>}
        {!hasMore && <span>No more posts to load</span>}
      </div>
    </div>
  );
}


// =====================================================================================
// 6. DRAG-AND-DROP LIST
// =====================================================================================
// Reorderable list via drag-and-drop (Native HTML5 DnD)

export function DragDropList() {
  const [items, setItems] = useState([
    { id: 1, text: 'Learn React' },
    { id: 2, text: 'Build a project' },
    { id: 3, text: 'Write tests' },
    { id: 4, text: 'Deploy to production' },
    { id: 5, text: 'Celebrate!' }
  ]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);
    
    setItems(newItems);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>To-Do List (Drag to Reorder)</h2>
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item, index) => (
          <li
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e, index)}
            style={{
              padding: '12px 16px',
              marginBottom: '8px',
              background: draggedIndex === index ? '#e0e7ff' : '#fff',
              border: dragOverIndex === index ? '2px dashed #2563eb' : '1px solid #e5e7eb',
              borderRadius: '4px',
              cursor: 'grab',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              opacity: draggedIndex === index ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
          >
            <span style={{ color: '#9ca3af' }}>⋮⋮</span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
      
      <p style={{ color: '#6b7280', fontSize: '14px' }}>
        Order: {items.map(i => i.id).join(' → ')}
      </p>
    </div>
  );
}


// =====================================================================================
// 7. TRANSFER (DUAL-LIST) COMPONENT
// =====================================================================================
// Two side-by-side lists with item transfer capabilities

export function TransferList() {
  const [leftItems, setLeftItems] = useState([
    { id: 1, name: 'JavaScript' },
    { id: 2, name: 'TypeScript' },
    { id: 3, name: 'Python' },
    { id: 4, name: 'Go' },
    { id: 5, name: 'Rust' }
  ]);
  const [rightItems, setRightItems] = useState([
    { id: 6, name: 'Java' },
    { id: 7, name: 'C#' }
  ]);
  const [leftSelected, setLeftSelected] = useState(new Set());
  const [rightSelected, setRightSelected] = useState(new Set());

  const toggleSelection = (id, side) => {
    const setSelected = side === 'left' ? setLeftSelected : setRightSelected;
    const selected = side === 'left' ? leftSelected : rightSelected;

    setSelected(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const moveToRight = () => {
    if (leftSelected.size === 0) return;
    
    const itemsToMove = leftItems.filter(item => leftSelected.has(item.id));
    setRightItems(prev => [...prev, ...itemsToMove]);
    setLeftItems(prev => prev.filter(item => !leftSelected.has(item.id)));
    setLeftSelected(new Set());
  };

  const moveToLeft = () => {
    if (rightSelected.size === 0) return;
    
    const itemsToMove = rightItems.filter(item => rightSelected.has(item.id));
    setLeftItems(prev => [...prev, ...itemsToMove]);
    setRightItems(prev => prev.filter(item => !rightSelected.has(item.id)));
    setRightSelected(new Set());
  };

  const moveAllToRight = () => {
    setRightItems(prev => [...prev, ...leftItems]);
    setLeftItems([]);
    setLeftSelected(new Set());
  };

  const moveAllToLeft = () => {
    setLeftItems(prev => [...prev, ...rightItems]);
    setRightItems([]);
    setRightSelected(new Set());
  };

  const ListBox = ({ items, selected, onToggle, title }) => (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      width: '200px',
      minHeight: '300px'
    }}>
      <div style={{ 
        padding: '12px', 
        borderBottom: '1px solid #e5e7eb',
        fontWeight: 'bold',
        background: '#f9fafb'
      }}>
        {title} ({items.length})
      </div>
      <div style={{ padding: '8px' }}>
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => onToggle(item.id)}
            style={{
              padding: '8px 12px',
              marginBottom: '4px',
              background: selected.has(item.id) ? '#dbeafe' : 'transparent',
              border: selected.has(item.id) ? '1px solid #2563eb' : '1px solid transparent',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {item.name}
          </div>
        ))}
        {items.length === 0 && (
          <p style={{ color: '#9ca3af', textAlign: 'center' }}>No items</p>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}>
      <ListBox 
        items={leftItems} 
        selected={leftSelected} 
        onToggle={(id) => toggleSelection(id, 'left')}
        title="Available"
      />
      
      {/* Transfer Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button onClick={moveAllToRight} title="Move All Right" style={{ padding: '8px 16px' }}>
          {'>>'}
        </button>
        <button onClick={moveToRight} disabled={leftSelected.size === 0} style={{ padding: '8px 16px' }}>
          {'>'}
        </button>
        <button onClick={moveToLeft} disabled={rightSelected.size === 0} style={{ padding: '8px 16px' }}>
          {'<'}
        </button>
        <button onClick={moveAllToLeft} title="Move All Left" style={{ padding: '8px 16px' }}>
          {'<<'}
        </button>
      </div>
      
      <ListBox 
        items={rightItems} 
        selected={rightSelected} 
        onToggle={(id) => toggleSelection(id, 'right')}
        title="Selected"
      />
    </div>
  );
}


// =====================================================================================
// 8. DYNAMIC TABLE FROM API
// =====================================================================================
// Fetch JSON and dynamically render as table with columns generated from data

export function DynamicTable() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const jsonData = await response.json();
      
      // Dynamically extract columns from first item
      if (jsonData.length > 0) {
        const cols = Object.keys(jsonData[0]).filter(
          key => typeof jsonData[0][key] !== 'object' // Exclude nested objects
        );
        setColumns(cols);
      }
      
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const formatColumnName = (col) => {
    return col.charAt(0).toUpperCase() + col.slice(1).replace(/([A-Z])/g, ' $1');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ overflowX: 'auto' }}>
      <h2>Dynamic Data Table</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            {columns.map(col => (
              <th
                key={col}
                onClick={() => handleSort(col)}
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {formatColumnName(col)}
                {sortConfig.key === col && (
                  <span style={{ marginLeft: '4px' }}>
                    {sortConfig.direction === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, index) => (
            <tr key={index} style={{ background: index % 2 === 0 ? '#fff' : '#f9fafb' }}>
              {columns.map(col => (
                <td key={col} style={{ padding: '12px', border: '1px solid #e5e7eb' }}>
                  {String(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


// =====================================================================================
// 9. SEARCH AUTOCOMPLETE INPUT
// =====================================================================================
// Input with dropdown suggestions, debounced API calls, keyboard navigation

export function SearchAutocomplete() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Debounce hook
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedQuery = useDebounce(query, 300);

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery.trim()) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        // Using JSONPlaceholder users as mock data
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const users = await response.json();
        
        const filtered = users.filter(user =>
          user.name.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
        
        setSuggestions(filtered);
        setShowSuggestions(true);
        setActiveIndex(-1);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0) {
          selectSuggestion(suggestions[activeIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveIndex(-1);
        break;
    }
  };

  const selectSuggestion = (suggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    setActiveIndex(-1);
    console.log('Selected:', suggestion);
  };

  // Close suggestions on outside click
  useOutsideClick(suggestionsRef, () => {
    setShowSuggestions(false);
    setActiveIndex(-1);
  });

  return (
    <div ref={suggestionsRef} style={{ position: 'relative', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Search Users</h2>
      
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Type to search..."
          aria-label="Search"
          aria-autocomplete="list"
          aria-controls="suggestions-list"
          aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxSizing: 'border-box'
          }}
        />
        
        {loading && (
          <span style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af'
          }}>
            Loading...
          </span>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul
          id="suggestions-list"
          role="listbox"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            margin: '4px 0 0 0',
            padding: 0,
            listStyle: 'none',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            maxHeight: '250px',
            overflowY: 'auto',
            zIndex: 1000
          }}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              id={`suggestion-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onClick={() => selectSuggestion(suggestion)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                background: index === activeIndex ? '#dbeafe' : 'transparent',
                borderBottom: index < suggestions.length - 1 ? '1px solid #f3f4f6' : 'none'
              }}
            >
              <div style={{ fontWeight: 500 }}>{suggestion.name}</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>{suggestion.email}</div>
            </li>
          ))}
        </ul>
      )}

      {showSuggestions && query && suggestions.length === 0 && !loading && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          padding: '12px',
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#6b7280'
        }}>
          No results found
        </div>
      )}
    </div>
  );
}


// =====================================================================================
// 10. ACCESSIBLE ACCORDION (ARIA + KEYBOARD)
// =====================================================================================
// Accordion with proper ARIA roles and keyboard support

export function AccessibleAccordion() {
  const [openPanels, setOpenPanels] = useState(new Set([0])); // First panel open by default
  const buttonRefs = useRef([]);

  const accordionData = [
    {
      title: 'What is React?',
      content: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and manage the state of their applications efficiently.'
    },
    {
      title: 'What are React Hooks?',
      content: 'Hooks are functions that let you use state and other React features in functional components. Common hooks include useState, useEffect, useContext, useRef, and useMemo.'
    },
    {
      title: 'What is the Virtual DOM?',
      content: 'The Virtual DOM is a lightweight copy of the real DOM. React uses it to optimize updates by comparing the virtual DOM with the real DOM and only updating what has changed.'
    },
    {
      title: 'How does useState work?',
      content: 'useState is a Hook that lets you add state to functional components. It returns an array with the current state value and a function to update it.'
    }
  ];

  const togglePanel = (index) => {
    setOpenPanels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleKeyDown = (e, index) => {
    const totalPanels = accordionData.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = (index + 1) % totalPanels;
        buttonRefs.current[nextIndex]?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = (index - 1 + totalPanels) % totalPanels;
        buttonRefs.current[prevIndex]?.focus();
        break;
      case 'Home':
        e.preventDefault();
        buttonRefs.current[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        buttonRefs.current[totalPanels - 1]?.focus();
        break;
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>FAQ</h2>
      
      <div role="presentation">
        {accordionData.map((item, index) => {
          const isOpen = openPanels.has(index);
          const headingId = `accordion-heading-${index}`;
          const panelId = `accordion-panel-${index}`;

          return (
            <div key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
              {/* Accordion Header */}
              <h3 style={{ margin: 0 }}>
                <button
                  ref={el => buttonRefs.current[index] = el}
                  id={headingId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => togglePanel(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 600,
                    textAlign: 'left'
                  }}
                >
                  <span>{item.title}</span>
                  <span 
                    aria-hidden="true"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  >
                    ▼
                  </span>
                </button>
              </h3>

              {/* Accordion Panel */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={headingId}
                hidden={!isOpen}
                style={{
                  padding: isOpen ? '0 16px 16px 16px' : '0 16px',
                  maxHeight: isOpen ? '500px' : '0',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
              >
                <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.6 }}>
                  {item.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ marginTop: '16px', color: '#6b7280', fontSize: '14px' }}>
        Keyboard: Arrow keys to navigate, Enter/Space to toggle, Home/End for first/last
      </p>
    </div>
  );
}


// =====================================================================================
// 11. ACCESSIBLE MODAL DIALOG (ARIA + KEYBOARD)
// =====================================================================================
// Reusable modal with ARIA attributes, keyboard support, and focus management

export function AccessibleModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <h2>Modal Dialog Demo</h2>
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          padding: '12px 24px',
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Open Modal
      </button>

      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        title="Confirm Action"
      >
        <p>Are you sure you want to proceed with this action?</p>
        <p style={{ color: '#6b7280' }}>This action cannot be undone.</p>
        
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              padding: '10px 20px',
              background: '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              console.log('Confirmed!');
              setIsOpen(false);
            }}
            style={{
              padding: '10px 20px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
}

// Reusable Modal Component
function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Store previously focused element and focus modal on open
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      closeButtonRef.current?.focus();
    } else if (previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  }, [isOpen]);

  // Handle escape key and trap focus
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Focus trap
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={modalRef}
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
        }}
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '4px 8px',
            color: '#6b7280'
          }}
        >
          ×
        </button>

        {/* Modal Title */}
        <h2 id="modal-title" style={{ margin: '0 0 16px 0' }}>
          {title}
        </h2>

        {/* Modal Content */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}


// =====================================================================================
// BONUS: CUSTOM HOOKS (Commonly asked in interviews)
// =====================================================================================

// useDebounce Hook
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// useLocalStorage Hook
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// useFetch Hook
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, { signal: controller.signal });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const json = await response.json();
        setData(json);
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

// usePrevious Hook
// export function usePrevious(value) {
//   const ref = useRef();
  
//   useEffect(() => {
//     ref.current = value;
//   }, [value]);
  
//   return ref.current;
// }

// useWindowSize Hook
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  const observerRef = useRef(null)

  useEffect(() => {
   observerRef.current = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting) {

      }
    }, {
      threshold: 0.1
    })

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    };

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}


