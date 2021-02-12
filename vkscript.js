var m = API.users.search({
        q: Args.name,
        sex: 2,
        count: 1000
    }),
    f = API.users.search({
        q: Args.name,
        sex: 1,
        count: 1000
    });
return {
    male: {
        count: m.count,
        fns: m.items@.first_name,
        lns: m.items@.last_name
    },
    female: {
        count: f.count,
        fns: f.items@.first_name,
        lns: f.items@.last_name
    }
};
