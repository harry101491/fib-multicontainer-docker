import React, { Component } from 'react';
import axios from 'axios';
import { fibState } from './interface';

class Fib extends Component {
    state:fibState = {
        seenIndices: [],
        values: {},
        index: ''
    };

    componentDidMount() {
        this.fetchIndexes();
        this.fetchValues();
    }

    async handleSubmitHandler(event: any) {
        event.preventDefault();

        await axios.post('/api/values', {
            index: this.state.index
        });

        this.setState((prevState, props) => {
            return {
                ...prevState,
                index: ''
            };
        });
    }

    async fetchValues() {
        const values = await axios.get('/api/values/current');
        this.setState((prevState, props) => {
            return {
                ...prevState,
                values: values.data
            };
        });
    }

    async fetchIndexes() {
        const indexes = await axios.get('/api/values/all');
        this.setState((prevState, props) => {
            return {
                ...prevState,
                seenIndexes: indexes.data
            };
        });
    }

    renderIndices() {
        return this.state.seenIndices.map(({ number }) => number).join(', ');
    }

    renderValues() {
        return Object.keys(this.state.values).map((fibIndex: string) => {
            return (
                <div key={fibIndex}>
                    For Index {fibIndex} I calculated {this.state.values[fibIndex]}
                </div>
            );
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmitHandler}>
                    <label>Enter your Index: </label>
                    <input 
                        type="text"
                        value={this.state.index}
                        onChange={(event) => {
                            this.setState((prevState, props) => {
                                return {
                                    ...prevState,
                                    index: event.target.value
                                };
                            })  
                        }}  
                    />
                    <button>Submit</button>
                </form>
                <h3>Indices I have seen:</h3>
                {this.renderIndices()}
                <h3>Calculated values:</h3>
                {this.renderValues()}
            </div>
        );
    }
}

export default Fib;
