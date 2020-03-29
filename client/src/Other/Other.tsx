import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Other extends Component {
    render() {
        return(
            <div>
                Other Page!
                <Link to="/">Go Home!</Link>
            </div>
        );
    }
}

export default Other;
