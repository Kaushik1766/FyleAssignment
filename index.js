

let form = document.getElementById('taxForm')
form.addEventListener('submit', (e) => {
    e.preventDefault()

    let inputFields = document.querySelectorAll('.form-control')
    let valid = 1

    // checking if submitted values are valid or not
    inputFields.forEach((item) => {
        // validating values
        if (validator(item.value) != 0) {
            valid = 0
        }
        validate(item.value, item.id)
    })

    let age = document.getElementById('age')

    if (age.value == -1) {
        document.getElementById('ageTooltip').classList.remove('visually-hidden')
        valid = 0
    }

    if (valid == 1) {

        // calculating final income before tax
        let finalIncome = parseFloat(inputFields[0].value) + parseFloat(inputFields[1].value) - parseFloat(inputFields[2].value)

        // check if total income > deduction
        if (finalIncome < 0) {
            document.querySelectorAll('.indicator').forEach((item) => {
                console.log(item);
                item.classList.add('bi-exclamation-circle', 'text-danger')
                item.classList.remove('bi-check-circle', 'text-success')
                item.setAttribute('data-bs-content', "deduction can't be greater than total income")
                rerunPopoverCreation()
            })
            return
        }

        // if final income <= 8lakhs display income as it is and return
        if (finalIncome <= 800000) {
            showIncome(finalIncome)
            return
        }

        // get taxable income
        let taxableIncome = finalIncome - 800000
        let tax = 0

        // calculating tax according to age
        if (age.value == 1) {
            tax = taxableIncome * 0.3
        }
        else if (age.value == 2) {
            tax = taxableIncome * .4
        }
        else if (age.value == 3) {
            tax = taxableIncome * .1
        }

        // subtracting tax from final income
        finalIncome -= tax

        // show income
        showIncome(finalIncome)
    }
})

// bootstrap function to rerender popovers and tooltips
function rerunPopoverCreation() {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
}

// function to check if the value is valid or not
function validator(value) {
    if (value == '' && parseFloat(value) != NaN) {
        return 'Input cannot be null'
    }
    if (value >= 0) {
        return 0;
    }
    else if (value < 0) {
        return 'Enter a valid positive number'
    }
    else {
        return 'Only numbers are allowed'
    }
}


// validates and updates the popover indicators to show the appropriate error or success messages
function validate(value, currentId) {
    let tooltipId = currentId + 'Tooltip';
    let tooltip = document.getElementById(tooltipId)
    let validateRes = validator(value)
    tooltip.classList.remove('visually-hidden')

    if (validateRes == 0) {
        tooltip.classList.remove('bi-exclamation-circle', 'text-danger')
        tooltip.classList.add('bi-check-circle', 'text-success')
        tooltip.setAttribute('data-bs-content', 'Looks good')
    }
    else {
        tooltip.classList.add('bi-exclamation-circle', 'text-danger')
        tooltip.classList.remove('bi-check-circle', 'text-success')
        tooltip.setAttribute('data-bs-content', validateRes)
    }
    rerunPopoverCreation()
}

function showIncome(income) {
    // show income output box
    document.getElementById('finalIncome').classList.remove('visually-hidden')
    // hide form
    document.getElementById('taxForm').classList.add('visually-hidden')
    // set value of income in HTML to the calculated value
    document.getElementById('incomeValue').innerHTML = income
}

function reset() {
    window.location.reload()
}