import React, { Component } from 'react';
import { 
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';

import './App.css';

import Other from './Other/Other';
import Fib from './Fib/Fib';

class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <header>
                        <Link to='/'>Home</Link>
                        <Link to='/other'>Other Page</Link>
                    </header>
                    <div>
                        <Route exact to='/' component={Fib} />
                        <Route exact to='/other' component={Other} />
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;