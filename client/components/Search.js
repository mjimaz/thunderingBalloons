import AddressList from './AddressList'; 
import React from 'react';

class Search extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h4>What? <input id='term' type='text' name='term' placeholder='what you want to do...' required/></h4>
        <h4>When?
          <input id='date' type='text' name='date' placeholder='date...' required/>
          <input id='time' type='text' name='time' placeholder='time...' required/>
          </h4>
        <div >
          <h4>Who?</h4>
          <AddressList users = {this.props.users}/>
        </div>
        <div style={ {margin: '10px'} }>
          <input className="btn btn-default" type='submit' value='Search Places' onClick = {() => searchPlaces(this.props.setStates, this.props.users)}/>
          <input className="btn btn-default" type='submit' value='Send Invite' onClick = {() => postEvent(this.props.places, this.props.users)}/>
        </div>
      </div> 
  )}
};

export default Search;