import { Component } from "react";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display: "modal",
            picture: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    closeModal() {
        this.setState({ display: "modal" });
    }

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
                <div id="myModal" className={this.state.display}>
                    <div>
                        <p>Here you can change your profile pic</p>
                    </div>
                    <div className="modal-content">
                        {/* <span className="close" onClick={this.closeModal}>
                            X
                        </span> */}
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
