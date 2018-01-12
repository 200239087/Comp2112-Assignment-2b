// Speech Synthesis API in deleteEmail()
// Voice Recognition API in voiceRecognition()
// Key Detection API in keyUp()

let app = new Vue({
    el: '#app',
    // mounted function to retrieve external JSON data
    mounted: function() {
        fetch("https://my.api.mockaroo.com/emails.json?key=e16d8bd0")
        .then(res => res.json())
        .then(emails => {
            this.emails = emails;
            this.selectedEmail = this.emails[0];
        })
        .catch(err => console.log(err));
    },

    data: {
        emails: [],
        selectedEmail: "",
        view: "inbox"
    },

    methods: {

        // JSON data does not provide pictures or thumbnails

        // getPic: function(emailObj) {
        //     return emailObj.picture.thumbnail;
        // },
      
        // getAlt(emailObj) {
        //   return `${emailObj.name.first} ${emailObj.name.last}'s avatar`;
        // },

        // Makes the selectedEmail equal to whichever email is clicked-on
        clickedEmail: function(emailObj) {
            this.selectedEmail = emailObj;
        },

        // Gives an email the class of isSelected so that the selectedEmail knows what to display
        isSelected: function(emailObj) {
            return emailObj == this.selectedEmail;
        },

        // When the Compose button is pushed then the method fetches more JSON data to add as a new incoming email
        incomingEmail() {
            fetch("https://my.api.mockaroo.com/emails.json?key=01c118d0")
            .then(res => res.json())
            .then(emails => {
                this.emails.unshift(emails[0]);
            })
            .catch(err => console.log(err));
        },

        // Displays the proper emails for whichever view it is
        currentView() {
            switch (this.view) {
              case "inbox":
                return this.emails.filter(email => !email.deleted);
                break;
              case "trash":
                return this.emails.filter(email => email.deleted);
                break;
            }
        },

        // Sets the current view of the page, whether you're looking at the inbox or trash page
        setView(clickedView) {
            this.view = clickedView;
        },

        // When an email is deleted then it is given the property of "deleted"
        // Text to Speech function will tell you when you delete an email
        deleteEmail() {
            this.$set(this.selectedEmail, "deleted", true);
            const host = new SpeechSynthesisUtterance();
            host.lang = "en-US";
            host.text = "Email Deleted";
            speechSynthesis.speak(host);
        }, 

        // Sets voice recognition, if the word "inbox" is spoken then the view will change to the inbox, and likewise with "trash"
        voiceRecognition() {
            window.SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

            let recognition = new SpeechRecognition();
            recognition.interimResults = false;
            recognition.lang = "en-US";

            recognition.addEventListener("result", e => {
                let transcript = e.results[0][0].transcript;
            console.log(transcript);

                // if "inbox" is spoken then the view will switch to inbox
                // if "trash" is spoken then the view will switch to trash
                if (transcript == 'inbox') {
                    this.view = 'inbox';
                }
                else if (transcript == 'trash') {
                    this.view = 'trash';
                }
            });
            recognition.addEventListener("end", recognition.start);
            recognition.start();
        }, 

        // Adds the Keydetection API
        keyUp() {
            window.addEventListener('keyup', (e) => {
                // console.log(e.key);
                // if "i" is clicked then the view will switch to inbox
                // if "t" is clicked then the view will switch to trash
                if (e.key == "i") {
                    this.view = 'inbox';
                }
                else if (e.key == "t") {
                    this.view = 'trash';
                }
            });
        }
    }
});