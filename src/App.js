import Header from './Header';
import React, { Component } from 'react';
import Row from './Row';
import AddUtil from './AddUtil';
import HideUtil from './HideUtil';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      locations: this.getInitialLocations(),
      showBooked: true
    };
  }

  getInitialLocations = () => {
    try {
      const savedLocations = localStorage.getItem("reservastions");
      const parsedData = savedLocations ? JSON.parse(savedLocations) : null;
      if (Array.isArray(parsedData)) {
        return parsedData;
      }
    }
    catch (error) {
      console.error("Error getting data", error);
    }

    return [
      {
        locationName: "Centennial Park",
        timeSlots: [
          { time: "9am-12pm", booked: false },
          { time: "12pm-3pm", booked: false },
          { time: "3pm-6pm", booked: false },
        ],
      },
      {
        locationName: "Grand Canyon",
        timeSlots: [
          { time: "9am-12pm", booked: false },
          { time: "12pm-3pm", booked: false },
          { time: "3pm-6pm", booked: false },
        ],
      },
      {
        locationName: "Niagara Falls",
        timeSlots: [
          { time: "9am-12pm", booked: false },
          { time: "12pm-3pm", booked: false },
          { time: "3pm-6pm", booked: false },
        ],
      },
      {
        locationName: "Sleeping Giant",
        timeSlots: [
          { time: "9am-12pm", booked: false },
          { time: "12pm-3pm", booked: false },
          { time: "3pm-6pm", booked: false },
        ],
      },
    ];
  };

  
  componentDidMount() {
    try {
      const data = localStorage.getItem("reservations");
      if (data) {
        const parsedData = JSON.parse(data);
        // Update state with saved data if valid
        if (Array.isArray(parsedData)) {
          this.setState({ locations: parsedData });
        }
      }
    }
    catch (error) {
      console.error("Failed to load data", error);
    }
  }

  
  componentDidUpdate(prevProps, prevState) {
    
    if (prevState.locations !== this.state.locations) {
      localStorage.setItem("reservations", JSON.stringify(this.state.locations));
    }
  }

 
  createLocation = (location) => {
    if (!this.state.locations.find(item => item.locationName === location)) {
      const updatedLocations = [
        ...this.state.locations,
        {
          locationName: location,
          timeSlots: [
            { time: "9am-12pm", booked: false },
            { time: "12pm-3pm", booked: false },
            { time: "3pm-6pm", booked: false },
          ],
        },
      ];
      this.setState({ locations: updatedLocations });
    }
  }

  
  toggleReservation = (reservation, timeSlot) => {
    const updatedLocations = this.state.locations.map(item =>
      item.locationName === reservation.locationName ? {
        ...item,
        timeSlots: item.timeSlots.map(slot =>
          slot.time === timeSlot ? { ...slot, booked: !slot.booked } : slot
        ),
      } : item
    );
    this.setState({ locations: updatedLocations });
  }

  
  reservationRow = (bookedValue) =>
    this.state.locations.flatMap(item =>
      item.timeSlots
        .filter(slot => slot.booked === bookedValue)
        .map(slot => (
          <tr key={`${item.locationName} - ${slot.time}`}>
            <td>{item.locationName}</td>
            <td>{slot.time}</td>
          </tr>
        ))
    );

  
  render() {
    const { locations, showBooked } = this.state;
    return (
      <div>
        {/* Header showing number of available destinations */}
        <Header locations={locations} />
        
        {/* Input section for adding new locations */}
        <div className="m-3">
          <AddUtil call={this.createLocation} />
        </div>
        
        <div className="container-fluid">
          {/* Main table showing all locations and their time slots */}
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Destinations</th>
                <th>Time Slots</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((item) => (
                <Row
                  key={item.locationName}
                  item={item}
                  toggle={this.toggleReservation}
                />
              ))}
            </tbody>
          </table>

          {/* Toggle for showing/hiding booked destinations */}
          <div className="bg-secondary text-white text-center p-2">
            <HideUtil
              description="Booked Destinations and time"
              isBooked={showBooked}
              call={(checked) => this.setState({ showBooked: checked })}
            />
          </div>

          {/* Conditional render of booked destinations table */}
          {showBooked && (
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Destinations</th>
                  <th>Time Slot</th>
                </tr>
              </thead>
              <tbody>{this.reservationRow(true)}</tbody>
            </table>
          )}
        </div>
      </div>
    );
  }
}

export default App;