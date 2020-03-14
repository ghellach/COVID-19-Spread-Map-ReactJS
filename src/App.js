import React, { Component }  from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route} from 'react-router-dom';
//Components
import Main from './Components/Main';
import axios from 'axios';

export class App extends Component {

    state = {
      countries: [],
      lastUpdated: []
    }

    componentWillMount (){
        axios({
            method: 'POST',
            url: 'https://backcovid.maghrebsystems.ca/all',
        }).then((res) => {
            this.setState({countries: res.data.countries_stat})
            this.setState({lastUpdated: res.data.statistic_taken_at})
        })
      }

      
    render() {
        return (
    
            <div className="App">
              <Router>
                <div>
                  <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                      <div className="container">
                          <a className="navbar-brand" href="">
                            <img src="https://us-central1-iconscout-1539.cloudfunctions.net/download?name=Syringe&download=1&url=https%3A%2F%2Fcdn.iconscout.com%2Ficon%2Ffree%2Fpng-512%2F1621997.png&width=512&height=512" width="5%" /> COVID-19 World Cases Map
                          </a>
                          
                          <div className="collapse navbar-collapse" id="navbarResponsive">
                              <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    
                                </li>
                              </ul>
                          </div>
                      </div>
                  </nav>
        
                  <div className="container-fluid">
                    <br/>
                    <Route exact path="/" >
                      <Main />
                    </Route>
                  </div>
                </div>
              </Router>
            </div>
          );
    }
}

export default App;
