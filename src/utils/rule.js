const role = {
    manager: 'MANAGER',
    admin: 'ADMIN',
    barista: 'BARISTA',
    cashier: 'CASHIER'

}
const baseRole = [role.manager, role.admin];
const rules = {
    nav: {
        user: {
            rule: [...baseRole]
        },
        menu: {
            rule: [...baseRole, role.cashier]
        },
        barista: {
            rule: [...baseRole, role.barista]
        },
        inventory: {
            rule: [...baseRole]
        },
        setting: {
            rule: [...baseRole]
        }
    },
    btn: {
        add_to_card: {
            rule: [...baseRole, role.cashier]
        }
    }
}

export default rules;