import { Component } from "react";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display: "modal",
            picture: "",
            // pic: this.props.url,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeModal = this.closeModal.bind(this);
        // this.togglePopup = this.togglePopup.bind(this);
    }

    closeModal() {
        this.setState({ display: "modal" });
    }
    // togglePopup() {
    //     this.setState({ isPopupOpen: !this.state.isPopupOpen });
    // }

    componentDidMount() {
        this.setState({ display: "modalOpen" });
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = e.currentTarget;
        const fileInput = form.querySelector("input[type=file]");
        if (fileInput.files.length < 1) return alert("you must add a file");

        const formData = new FormData(form);

        fetch("/image", {
            method: "POST",
            body: formData,
        })
            .then((result) => result.json())
            .then((data) => {
                console.log("my data I am getting back is ", data);
                this.props.changeProfilePic(data.picture);
            });
    }

    render() {
        return (
            <>
                <div className="overlay"></div>
                <div id="myModal" className={this.state.display}>
                    <h4 className="close" onClick={this.props.togglePopup}>
                        X
                    </h4>
                    {/* <div>
                        <img className="" src={this.state.url}></img>
                    </div> */}
                    <div>
                        <p>Here you can change your profile pic</p>
                    </div>
                    <div className="modal-content">
                        <form
                            encType="multipart/form-data"
                            onSubmit={this.handleSubmit}
                        >
                            <input type="file" accept="image/*" name="photo" />
                            <input type="submit" name="button" value="submit" />
                        </form>
                    </div>
                </div>
            </>
        );
    }
}
