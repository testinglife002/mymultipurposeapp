import api from '../api';

export async function uploadToCloudinary(file) {
  const { data: sig } = await api.get('/uploads/signature');
  const form = new FormData();
  form.append('file', file);
  form.append('api_key', sig.apiKey);
  form.append('timestamp', sig.timestamp);
  form.append('signature', sig.signature);
  form.append('folder', sig.folder);
  const url = `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`;
  const res = await fetch(url, { method: 'POST', body: form });
  if (!res.ok) throw new Error('Cloudinary upload failed');
  const json = await res.json();
  return json.secure_url;
}
