import { Routes, Route, BrowserRouter} from 'react-router-dom';
import ShowMovies from './components/ShowMovies';
import ShowActors from './components/ShowActors';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/movie' element={<ShowMovies></ShowMovies>}></Route>
        <Route path='/actor' element={<ShowActors></ShowActors>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
