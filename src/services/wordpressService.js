import axios from 'axios';

const baseURL = 'https://api.thecatapi.com/v1';

const catAPIService = axios.create({
  baseURL,
});

export const fetchCatBreeds = async () => {
  try {
    const response = await catAPIService.get('/breeds');
    return response.data;
  } catch (error) {
    console.error('Error fetching cat breeds:', error);
    return [];
  }
};

export const fetchCatImages = async (breedId) => {
  try {
    const response = await catAPIService.get(`/images/search?breed_ids=${breedId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cat images:', error);
    return [];
  }
};

export default catAPIService;
