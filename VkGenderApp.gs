class VkGenderApp {
  constructor(obj) {
    this.lang = obj.lang;
    this.v = obj.v;
    this.token = obj.token;
  }
  getVkData(str) {
    const http_build_query = (formdata, numeric_prefix) => { // Generate URL-encoded query string
      var key, use_val, use_key, i = 0,
        tmp_arr = [];
      for (key in formdata) {
        use_key = escape(key);
        use_val = encodeURIComponent((formdata[key].toString()));
        use_val = use_val.replace(/%20/g, '+');
        if (numeric_prefix && !isNaN(key)) {
          use_key = numeric_prefix + i;
        }
        tmp_arr[i] = use_key + '=' + use_val;
        i++;
      }
      return tmp_arr.join('&');
    },
      request_params = {
        lang: this.lang,
        v: this.v,
        access_token: this.token,
        name: str
      },
      options = {
        "muteHttpExceptions": true,
        "headers": {
          "Authorization": "Bearer",
          "Accept-Language": "ru"
        },
        "method": "post",
        "contentType": "application/json; charset=utf-8",
      },
      get_params = http_build_query(request_params, ''),
      url = `https://api.vk.com/method/execute.searchNames?${get_params}`; // https://api.vk.com/method/METHOD_NAME?PARAMETERS&access_token=ACCESS_TOKEN&v=V 

    var response,
      responseCode;
    while (responseCode != 200) {
      Utilities.sleep(1000);
      response = UrlFetchApp.fetch(url, options);
      if (response != undefined) {
        responseCode = response.getResponseCode();
      }
    }
    var data_obj = JSON.parse(response);
    data_obj.response.str = str;
    return data_obj;
  }
  parseVkData(obj) {
    if ((typeof obj.error == 'undefined') && (!!obj.response)) {
      var result = {
        name: obj.response.str,
        type: '',
        nameSynonyms: null,
        data: {
          popularity: 0,
          maleShare: 0.00,
          femaleShare: 0.00
        },
      };
      var male_count = obj.response.male.count,
        female_count = obj.response.female.count,
        male_names = obj.response.male.fns,
        male_lastnames = obj.response.male.lns,
        female_names = obj.response.female.fns,
        female_lastnames = obj.response.female.lns,
        names = {
          male: {
            first: +0,
            synonyms: [],
            last: +0
          },
          female: {
            first: +0,
            synonyms: [],
            last: +0
          },
        };
      if ((male_names.length > +0) || (male_lastnames.length > +0) || (female_names.length > +0) || (female_lastnames.length > +0)) {
        for (var i = 0; i < male_names.length; i++) {
          if (result.name == male_names[i]) {
            names.male.first++;
          } else {
            if (male_names[i].match(/^([а-яА-Я]+)$/g)) {
              names.male.synonyms.push([toTitleCase(male_names[i]), +1]);
            }
          }
        }
        for (var i = 0; i < male_lastnames.length; i++) {
          if (result.name == male_lastnames[i]) {
            names.male.last++;
          }
        }
        for (var i = 0; i < female_names.length; i++) {
          if (result.name == female_names[i]) {
            names.female.first++;
          } else {
            if (female_names[i].match(/^([а-яА-Я]+)$/g)) {
              names.female.synonyms.push([toTitleCase(female_names[i]), +1]);
            }
          }
        }
        for (var i = 0; i < female_lastnames.length; i++) {
          if (result.name == female_lastnames[i]) {
            names.female.last++;
          }
        }
        result.data.popularity = +male_count + +female_count;
        if (female_count > +0) {
          result.data.femaleShare = (+female_count / +result.data.popularity).toFixed(2);
        } else {
          result.data.femaleShare = (+0).toFixed(2);
        }
        if (male_count > +0) {
          result.data.maleShare = (+male_count / +result.data.popularity).toFixed(2);
        } else {
          result.data.maleShare = (+0).toFixed(2);
        }
        if ((+names.male.first + +names.female.first) > (+names.male.last + +names.female.last)) {
          result.type = 'first';
        } else {
          result.type = 'last';
        }
        if (result.type == 'first') {
          var arr = [];
          if (+result.data.maleShare > +result.data.femaleShare) {
            arr = names.male.synonyms;
          }
          if (+result.data.femaleShare > +result.data.maleShare) {
            arr = names.female.synonyms;
          }
          if (arr.length > +0) {
            var reportSynonyms = [];
            var uniqueSynonyms = unique(arr).sort();
            for (var ie = 0; ie < uniqueSynonyms.length; ie++) {
              for (var ir = 0; ir < arr.length; ir++) {
                if (uniqueSynonyms[ie][0] == arr[ir][0]) {
                  uniqueSynonyms[ie][1] = +uniqueSynonyms[ie][1] + +1;
                }
              }
              if ((+uniqueSynonyms[ie][1] > 4) && (reportSynonyms.join().length < 900)) {
                reportSynonyms.push(uniqueSynonyms[ie][0]);
              }
            }
            reportSynonyms = unique(reportSynonyms);
            if ((reportSynonyms.length > +0) && (reportSynonyms.join().length < 1000)) {
              result.nameSynonyms = reportSynonyms.join(', ');
            }
          }
        }
      }
    }
    return result;
  }
}
