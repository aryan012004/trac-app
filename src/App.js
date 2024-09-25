
import logo from './logo.svg';
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './Component/Header';

import ViewBook from './Component/ViewBook';

import ViewAllExpenses from './Component/ViewalExpnese';
import AddexpTracker from './Component/AddexpTracker';

function App() {
  return (
    <div className="App">
           <BrowserRouter>
         <Header/>
          <Routes>
                 
                 
               
               
                <Route path="/" element={<AddexpTracker/>} />
                <Route path="/viewallexpenses" element={<ViewAllExpenses/>} />
               <Route path='/viewbook/:id' element={<ViewBook/>}/>
                 
                  
                  
          </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
