

import { useState } from 'react';
import { useAuth } from '../auth.jsx';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');


	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		if (!username || !password) {
			setError('Please enter username and password');
			return;
		}
		try {
			const res = await api.post('/auth/login', { email: username, password });
			if (res.data && res.data.token) {
				login({ username, token: res.data.token });
				navigate('/');
			} else {
				setError('Invalid response from server');
			}
		} catch (err) {
			setError(err.response?.data?.message || 'Login failed');
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-slate-100">
			<form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
				<div className="text-2xl font-bold mb-6 text-slate-800">Login</div>
				<input
					type="text"
					placeholder="Username"
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
					Login
				</button>
				<div className="mt-4 text-center text-sm text-slate-600">
					New here?{' '}
					<a href="/signup" className="text-indigo-600 hover:underline">Sign up</a>
				</div>
			</form>
		</div>
	);
}
