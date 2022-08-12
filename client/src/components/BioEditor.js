import { Component } from "react";

class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = { draftBio: "", isTheEditorOpen: false, bio: "" };
        this.toggleTheEditor = this.toggleTheEditor.bind(this);
        this.onBioInputChange = this.onBioInputChange.bind(this);
        this.fetchNewBioToTheServer = this.fetchNewBioToTheServer.bind(this);
    }

    toggleTheEditor() {
        this.setState({ isTheEditorOpen: !this.state.isTheEditorOpen });
    }

    onBioInputChange(e) {
        this.setState({ draftBio: e.target.value });
        console.log("this.state.draftBio: ", this.state.draftBio);
        // console.log("e", e);
    }

    fetchNewBioToTheServer() {
        this.toggleTheEditor();
        this.props.saveDraftBio(this.state.draftBio);
        const userBio = this.state.draftBio;
        console.log("userBio: ", userBio);

        fetch("/insertTheBio.json", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userBio }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("data: ", data);

                if (!data.success && data.message) {
                    this.setState({ errorMessage: data.message });
                } else {
                    this.setState.bio = data.userBio;
                }
            })
            .catch((error) => {
                console.log("error on fetch : ", error);
            });
    }

    render() {
        return (
            <>
                <p>Welcome to Bio Editor. Click to the button to change it</p>
                {this.state.isTheEditorOpen ? (
                    <>
                        <div>
                            <textarea
                                name="bio"
                                cols="30"
                                rows="10"
                                onChange={this.onBioInputChange}
                            >
                                {this.props.bio}
                            </textarea>
                        </div>
                        <button
                            onClick={
                                (this.toggleTheEditor,
                                this.fetchNewBioToTheServer)
                            }
                        >
                            Save
                        </button>
                    </>
                ) : (
                    <>
                        {this.props.bio ? (
                            <>
                                <p>{this.props.bio}</p>
                                <button onClick={this.toggleTheEditor}>
                                    Edit
                                </button>
                            </>
                        ) : (
                            <button onClick={this.toggleTheEditor}>Add</button>
                        )}
                    </>
                )}
            </>
        );
    }
}

export default BioEditor;
