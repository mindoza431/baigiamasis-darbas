import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Rating } from '@mui/material';
import { Button, TextField, Box, Typography, Card, CardContent, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface Review {
  _id: string;
  user: {
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface ApiResponse {
  data: Review[];
}

interface UserResponse {
  data: {
    role: string;
  };
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      if (id) {
        console.log('Initializing data for product:', id);
        await Promise.all([
          fetchReviews(),
          checkAdmin()
        ]);
      }
    };

    initializeData();
  }, [id]);

  const checkAdmin = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        setIsAdmin(false);
        return;
      }

      console.log('Checking admin status...');
      console.log('API URL:', `${API_URL}/api/auth/me`);
      console.log('Token:', token);

      const res = await axios.get<UserResponse>(`${API_URL}/api/auth/me`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('User data response:', res.data);
      
      if (res.data && res.data.data) {
        const isUserAdmin = res.data.data.role === 'admin';
        console.log('Is user admin:', isUserAdmin);
        setIsAdmin(isUserAdmin);
      } else {
        console.log('Invalid response format:', res.data);
        console.log('Expected format: { data: { role: string } }');
        setIsAdmin(false);
      }
    } catch (error: any) {
      console.error('Error checking admin status:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setIsAdmin(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('API URL:', `${API_URL}/api/reviews/product/${id}`);
      const res = await axios.get<ApiResponse>(`${API_URL}/api/reviews/product/${id}`, {
        headers: token ? { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } : {}
      });
      console.log('Reviews response:', res.data);
      setReviews(res.data.data || []);
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      setError('Nepavyko gauti atsiliepimų: ' + (error.response?.data?.message || error.message));
      setReviews([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Turite prisijungti, kad galėtumėte palikti atsiliepimą');
        return;
      }

      console.log('Submitting review:', { rating, comment });
      console.log('API URL:', `${API_URL}/api/reviews/product/${id}`);
      console.log('Token:', token);

      if (editingReview) {
        console.log('Updating review:', editingReview);
        const response = await axios.put(
          `${API_URL}/api/reviews/${editingReview}`,
          { rating, comment },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Update response:', response.data);
        setEditingReview(null);
      } else {
        console.log('Adding new review');
        const response = await axios.post(
          `${API_URL}/api/reviews/product/${id}`,
          { rating, comment },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Add response:', response.data);
      }

      setRating(0);
      setComment('');
      await fetchReviews();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      console.error('Error response:', error.response?.data);
      setError(
        error.response?.data?.message || 
        error.message || 
        'Įvyko klaida bandant pridėti atsiliepimą'
      );
    }
  };

  const handleDelete = async (reviewId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Turite prisijungti, kad galėtumėte ištrinti atsiliepimą');
        return;
      }
      await axios.delete(`${API_URL}/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReviews();
    } catch (error: any) {
      console.error('Error deleting review:', error);
      setError(error.response?.data?.message || 'Nepavyko ištrinti atsiliepimo');
    }
  };

  const handleEdit = (review: Review) => {
    setRating(review.rating);
    setComment(review.comment);
    setEditingReview(review._id);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Produkto Atsiliepimai
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Atsiliepimų ssrašas */}
      <Box sx={{ mb: 4 }}>
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review._id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">{review.user.name}</Typography>
                  {isAdmin && (
                    <Box>
                      <IconButton 
                        onClick={() => handleEdit(review)}
                        color="primary"
                        title="Redaguoti atsiliepimą"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDelete(review._id)}
                        color="error"
                        title="Ištrinti atsiliepimą"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                <Rating value={review.rating} readOnly />
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {review.comment}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(review.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            Dar nėra atsiliepimų
          </Typography>
        )}
      </Box>

      {/* Atsiliepimo forma */}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          {editingReview ? 'Redaguoti Atsiliepimą' : 'Palikti Atsiliepimą'}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography component="legend">Įvertinimas</Typography>
          <Rating
            value={rating}
            onChange={(event: React.SyntheticEvent, newValue: number | null) => setRating(newValue || 0)}
            precision={1}
          />
        </Box>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Komentaras"
          value={comment}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setComment(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!rating || !comment}
        >
          {editingReview ? 'Atnaujinti' : 'Pridėti'} Atsiliepimą
        </Button>
        {editingReview && (
          <Button
            onClick={() => {
              setEditingReview(null);
              setRating(0);
              setComment('');
            }}
            sx={{ ml: 2 }}
          >
            Atšaukti
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ProductDetails; 