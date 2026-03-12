

import { useState } from 'react';
import { useAuth } from '../auth.jsx';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Signup() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		if (!username || !password) {
			setError('Please enter email and password');
			return;
		}
		try {
			const res = await api.post('/auth/register', { email: username, password });
			if (res.data && res.data.user) {
				// Auto-login after signup
				const loginRes = await api.post('/auth/login', { email: username, password });
				if (loginRes.data && loginRes.data.token) {
					login({ username, token: loginRes.data.token });
					navigate('/settings', { state: { uploadCsv: true } });
				} else {
					setError('Signup succeeded but login failed');
				}
			} else {
				setError('Signup failed');
			}
		} catch (err) {
			setError(err.response?.data?.message || 'Signup failed');
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-slate-100">
			<form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
				<div className="text-2xl font-bold mb-6 text-slate-800">Sign Up</div>
				<input
					type="email"
					placeholder="Email"
					value={username}
					onChange={e => setUsername(e.target.value)}
					className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring"
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={e => setPassword(e.target.value)}
					className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring"
				/>
				{error && <div className="text-red-600 mb-2">{error}</div>}
				<button
					type="submit"
					className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors"
				>
					Sign Up
				</button>
			</form>
		</div>
	);
}
