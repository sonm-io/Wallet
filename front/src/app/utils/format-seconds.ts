import * as moment from 'moment';

export function formatSeconds(seconds: number) {
    return moment.duration(seconds, 'seconds').humanize();
}

export default formatSeconds;
