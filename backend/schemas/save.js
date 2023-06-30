export default {
    name: "save",
    title: "Save",
    type: "document",
    fields: [
        {
            name: "postedBy",
            title: "PostedBy",
            type: "postedBy"
        },
        {
            name: "userId",   // of the user who saved that particular pin
            title: "UserId",
            type: "string"
        },
    ]
}