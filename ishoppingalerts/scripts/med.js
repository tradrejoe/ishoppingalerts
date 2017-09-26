    var HOUR = 1000 * 60 * 60;
    function med(medname, dosage, unit, frequency, refill, remaining, starting, alarm, alarm_level) {
        this.medname = medname;
        this.dosage = dosage;
        this.unit = unit;
        this.frequency = frequency;
        this.refill = refill;
        this.remaining = remaining;
        this.starting = starting;
        this.alarm = alarm;
        this.alarm_level = alarm_level;

        this.toString = function () {
            var buf = "";
            for (var prp in this) {
                if (typeof this[prp] !== 'function')
                    buf += prp + "=" + this[prp] + ";"
            }
            return buf;
        }

        this.getSqlCreate = function () {
            return "CREATE TABLE IF NOT EXISTS medicine (medname TEXT NOT NULL PRIMARY KEY, " +
			  "dosage FLOAT NOT NULL DEFAULT 1, unit TEXT, frequency FLOAT NOT NULL DEFAULT 24, refill FLOAT NOT NULL DEFAULT 100, " +
			  "remaining FLOAT, starting FLOAT NOT NULL, alarm TEXT, alarm_level FLOAT)";
        }

        this.getRemaining = function () {
            var today = (new Date()).getTime();
            var vdate = this.starting;
            var vdosage = this.dosage;
            var vrefill = this.refill;
            if (vrefill <= 0) return 0;
            var tmprmn = vrefill;
            var vfrequency = this.frequency;
            if (vdate >= today) return 100;
            while (today >= vdate) {
                var vtaken = true;
                switch (vfrequency) {
                    case -1:
                    case -2:
                        vdate += HOUR * 24;
                        break;
                    default:
                        vdate += HOUR * vfrequency;
                        break;
                }
                if (today >= vdate) {
                    var vdayofweek = (new Date(vdate)).getDay();
                    switch (vfrequency) {
                        case -1: //week days
                            if (vdayofweek == 0 || vdayofweek == 6)
                                vtaken = false;
                            break;
                        case -2: //week ends
                            if (vdayofweek >= 1 && vdayofweek <= 5)
                                vtaken = false;
                            break;
                        default:
                            break;
                    }
                }
                if (vtaken) tmprmn -= vdosage;
                if (tmprmn <= 0) return 0;

            }
        }

        this.getKeyFields = function () {
            return ['medname'];
        }

        return this;
    }