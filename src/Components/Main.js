import React, { Component } from 'react'
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup, CircleMarker} from 'react-leaflet';
import axios from 'axios';
import { popupContent, popupHead, popupText, okText } from "./popupStyles";

export class Main extends Component {
    
    
    constructor(props) {
        super(props);
        this.state = {
            lat: 20,
            lng: -15.301048,
            countries: [],
            general: []
        }
        this.popup = React.createRef();

    }

    componentWillMount (){
        axios({
            method: 'POST',
            url: 'https://backcovid.maghrebsystems.ca/all',
        }).then((res) => {
            this.setState({countries: res.data.countries_stat})
            this.setState({lastUpdated: res.data.statistic_taken_at})
        })
        this.fetchGlobalData()
    }
    
    fetchGlobalData = () => {
        axios({
            method: 'POST',
            url: 'https://backcovid.maghrebsystems.ca/general',
        }).then((res) => {
            this.setState({
                total: res.data.total_cases,
                recovered: res.data.total_recovered,
                deaths: res.data.total_deaths,
                place: 'Global',
            })
        })
        this.setState({
            lat: 20,
            lng: -15.301048,
            zoom: 2,
        })
    }
    update = (name, cases, deaths, recovered, lat, lng) => {
        this.setState({
            total: cases,
            recovered: recovered,
            deaths: deaths,
            place: name,
            zoom:4,
            lat: lat,
            lng: lng
        })
        this.setState({
            todos: [...this.state.countries.filter(country => country.country_name !== name)]
          })
        console.log(name, cases, deaths, recovered)
    }

    reset = () => {
        this.fetchGlobalData();
    }
    
    render() {
        let title;
        if(this.state.place === 'Global'){
            title = <h2>{ this.state.place } Cases</h2>
        }else{
            title = <React.Fragment>
                <h2>Cases in  { this.state.place } </h2>
                
                </React.Fragment>
        }
        const list = this.state.countries.map(row => (
            <p>
                <CircleMarker onClick={() => this.update(row.country_name, row.cases, row.deaths, row.total_recovered, row.lat, row.lng)} center={[row.lat, row.lng]} color={row.color} radius={row.radius}>
                <Popup onClose={() => this.reset()} className="request-popup text-center" style={{backgroundColor: 'grey'}}>
                    <button className="btn btn-danger btn-block" style={{pointerEvents: 'none'}}>
                        <b>{row.country_name}</b>
                    </button>
                    <table className="table table-dark">
                        <tbody>
                            <tr>
                            <th scope="row">Total Cases</th>
                            <td>{row.cases}</td>
                            </tr>
                            <tr>
                            <th scope="row">Total Recovered</th>
                            <td>{row.total_recovered}</td>
                            </tr>
                            <tr>
                            <th scope="row">Total Deaths</th>
                            <td>{row.deaths}</td>
                            </tr>
                        </tbody>
                    </table>
                </Popup>
                </CircleMarker>
            </p>
        ))
        const position = [this.state.lat, this.state.lng]
        return (

            <div className="row content">
                
                <div className="col-lg-7">
                    <div className="">
                    <h6>COVID-19 spread progression map (latest data)</h6>
                    <Map className="map" center={position} zoom={this.state.zoom}>
                        <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
                        />
                        {list}
                    </Map>
                    </div>
                </div>

                <div className="col-md-3" >
                
                    <div className="bd-example">

                        <div className="card card-body text-center">
                            {title}
                            <div className="card border-primary mb-3 card-block" style={{maxWidth: '18rem'}}>
                                <div className="card-body text-primary">
                                    <h2 className="card-title">{ this.state.total }</h2>
                                    <p className="card-text">total cases</p>
                                </div>
                            </div>

                            <div className="card border-success mb-3" style={{maxWidth: '18rem'}}>
                                <div className="card-body text-success">
                                    <h2 className="card-title">{ this.state.recovered }</h2>
                                    <p className="card-text">total recovered</p>
                                </div>
                            </div>

                            <div className="card border-danger mb-3" style={{maxWidth: '18rem'}}>
                                <div className="card-body text-danger">
                                    <h2 className="card-title">{ this.state.deaths }</h2>
                                    <p className="card-text">total deaths</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-2">
                    <div className="bd-example">
                        <div className="card card-body text-center">
                            <h6>Last updated at {this.state.lastUpdated} UTC</h6>
                            <hr/>
                            <p>Data from <a href="https://rapidapi.com/astsiatsko/api/coronavirus-monitor">astsiatsko (Rapid API)</a></p><hr/>
                            <p>Application build by Achraf Ghellach.</p>
                            <h6><a target="blank" href="https://github.com/ghellach"><i className="fab fa-github"></i> My Github</a></h6>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default Main
