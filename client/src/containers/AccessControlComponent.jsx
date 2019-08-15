import React, { Component } from "react";
import { connect } from "react-redux";



class AccessControlComponent extends Component {

    shouldComponentUpdate(nextProps) {
        if (this.props.loggedIn !== nextProps.loggedIn) {
            return true;
        }
    }

    render() {
        let Component = this.props && this.props.onSuccess;
        if (this.props) {
            if (this.props.loggedIn) {
                return (
                    <Component {...this.props} />
                )
            } else {
                let FailureComponent = this.props.onFailure;
                return (
                    <FailureComponent {...this.props} />
                )
            }
        } else {
            return (
                <div style={{color: "white"}}>
                    <h1>Checking Access</h1>
                    <p>
                        Please Wait
                    </p>
                </div>
            )
        }
    }

}

const mapStateToProps = (state) => {
    return {
        loggedIn: state.user.loggedIn
    }
}

const mapDispatchToProps = () => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(AccessControlComponent);