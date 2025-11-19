import axios from 'axios';
import Constants from 'expo-constants'; // Import Constants

const { manifest } = Constants;

// Garante que o manifest e o debuggerHost existam antes de tentar usá-los
const uri = manifest?.debuggerHost
  ? `http://${manifest.debuggerHost.split(':').shift()}:8080`
  : 'http://localhost:8080';

const api = axios.create({
  baseURL: uri,
});

export default api;
