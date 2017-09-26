    ltrim = function (srch) {
        return srch.replace(/^([\s]*)(\S)/, '$2');
    }
    rtrim = function (srch) {
        return srch.replace(/(\S)([\s]*)$/, '$1');
    }
    trim = function (srch) {
        return ltrim(rtrim(srch));
    }
    isNumeric = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }