
let util = {

    grabElements: (obj, ids) => {

        for (let id in ids)
            obj[id] = document.getElementById(ids[id]);

    },

    verifyNoneEmpty: (element, errorElement, field) => {

        if (element.value === undefined || element.value === "") {
            element.parentElement.classList.add("is-invalid");
            errorElement.textContent = field + " is required.";
            return false;
        }

        return true;

    },

    setTextField: (element, value) => {

        element.value = value;
        if (value.toString() !== "") element.parentElement.classList.add("is-dirty");
        else element.parentElement.classList.remove("is-dirty");

    }

};
