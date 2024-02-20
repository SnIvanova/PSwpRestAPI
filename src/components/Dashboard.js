import React from 'react';
import CreatePost from "./CreatePost";

class Dashboard extends React.Component {

	constructor( props ) {
		super( props );
	}


	render() {
		console.warn( localStorage.getItem( 'token' ) );
		return(
			<React.Fragment>
		
				<div className="jumbotron" style={{ height: '100vh' }}>
					<h4>Welcome {this.props.userName && this.props.userName }!!</h4>
					<CreatePost/>
				</div>
			</React.Fragment>
		)
	}
}

export default Dashboard;
