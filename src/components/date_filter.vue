<template>
    <div>
        <div
            class="bg-white cursor-pointer flex gap-2"
            :class="sla ? 'px-3 py-1.5 rounded-lg border border-gray-950/10 justify-center items-center h-[38px]' : 'text-gray-700 rounded-lg p-3 shadow-sm'"
            @click="pickerIsOpen = !pickerIsOpen"
        >
            <CalendarIcon class="my-auto text-gray-500" :class="sla ? 'w-4 h-4' : 'w-5 h-5'" />
            <p :class="sla ? 'text-gray-950 text-sm font-medium mt-[1px]' : 'my-auto'">{{ formatDate(currentSpan) }}</p>
            <ChevronDownIcon v-if="!pickerIsOpen && sla" class="w-4 h-4 text-gray-500" />
            <ChevronUpIcon v-else-if="pickerIsOpen && sla" class="w-4 h-4 text-gray-500" />
        </div>
        <div v-if="pickerIsOpen" class="sm:flex bg-white border border-gray-300 shadow-lg rounded-lg absolute z-50 mt-2">
            <div v-if="!checkWidth" data-cy="divMenuPicker" class="flex flex-col border-r p-2">
                <button
                    v-for="(filt, i) of filters"
                    :key="i"
                    class="flex justify-center sm:justify-start rounded h-9 py-[2px] px-4 mb-1 leading-8 w-full sm:w-[181px] hover:bg-gray-50"
                    :class="!['Last week', 'Last 30 days', 'Last month'].includes(filt.text) && isDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'"
                    :disabled="['Last week', 'Last 30 days', 'Last month'].includes(filt.text) ? false : isDisabled"
                    @click="filt.text.includes('Last month') ? setPeriod(DATES[filt.text], true) : setPeriod(DATES[filt.text], false)"
                >
                    {{ filt.text }}
                </button>
            </div>
            <div v-else class="p-2 w-full rounded-t-lg" :class="userStore.user.tier === 'paid' || userStore.user.teamStatus === 'member' ? '' : 'bg-gray-50'">
                <SelectCustom
                    optional-class="w-full"
                    :select-value="{ text: currentFilter }"
                    :items="filters"
                    :options-disabled="optionsDisabled"
                    placeholder="Select a response"
                    state="default"
                    @selectEvent="handleFilters"
                />
            </div>
            <div v-if="userStore.user.tier === 'paid' || userStore.user.teamStatus === 'member'" data-cy="divCalendarPicker" class="p-4 pt-2">
                <datepicker
                    ref="calendar"
                    maximum-view="day"
                    :inline="true"
                    :use-utc="true"
                    class="calendar"
                    :class="[!isSameMonth ? 'blue' : '', isSameDay ? 'oneDay' : '']"
                    :disabled-dates="{ customPredictor: disableDate }"
                    :open-date="openDate"
                    :highlighted="currentSpanHighlight"
                    :full-month-name="true"
                    @input="dateSelected"
                ></datepicker>
                <div class="mt-2 flex justify-end sm:absolute sm:bottom-4 sm:right-4">
                    <ButtonComp class="mr-3 h-[38px]" size="base" type="button" text="Cancel" hierarcy="outline" @click="pickerIsOpen = false" />
                    <ButtonComp class="h-[38px]" size="base" type="button" text="Apply" hierarcy="primary" @click="applyFilter" />
                </div>
            </div>
            <div v-else class="rounded-b-lg sm:rounded-bl-none pt-8 pb-4 sm:pb-0 sm:pt-0 sm:h-[376px] bg-gray-50 px-4 flex items-center sm:rounded-r-lg">
                <div class="w-[280px] h-[246px] text-center flex flex-col justify-center">
                    <div class="w-[200px] h-[110px] mb-3 mx-auto">
                        <img class="w-full h-full" src="../../../resources/static/favicon/date_filter/Illustration.svg" />
                    </div>
                    <p class="font-medium text-gray-900 text-normal h-5 mb-2">Unlock custom date ranges</p>
                    <p class="w-full h-12 text-xs text-gray-600">With a paid account you can select custom date ranges to analyze any time period you want, up to two years of historical data.</p>
                    <div class="flex justify-center">
                        <ButtonComp class="mt-4 h-[38px]" type="button" text="Upgrade now" size="base" hierarcy="primary" to="/settings/plans" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import Datepicker from 'vuejs3-datepicker';




export default {
    name: 'DateFilter',
    components: {

        Datepicker,

    },
    props: {
        filter: {
            type: Object,
            default: null
        },
        sla: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            pickerIsOpen: false,
            currentFilter: '',
            currentSpan: {
                from: null,
                to: null
            },

            filters: [
                { text: 'Yesterday' },
                { text: 'This week' },
                { text: 'Last week' },
                { text: 'Last 30 days' },
                { text: 'This month' },
                { text: 'Last month' },
                { text: 'Last 3 months' },
                { text: 'Last 6 months' },
                { text: 'This year' }
            ],

        };
    },
    computed: {
        checkWidth() {
            return window.innerWidth < 641;
        },
        isSameDay() {
            return dayjs(this.currentSpan.to).$D === dayjs(this.currentSpan.from).$D;
        },
        isSameMonth() {
            return dayjs(this.currentSpan.to).$M === dayjs(this.currentSpan.from).$M;
        },
        isDisabled() {
            return (this.userStore.user.tier === 'free' && !this.userStore.user.teamStatus) || this.userStore.user?.subscriptionType === 'trial';
        },
        optionsDisabled() {
            if (this.isDisabled) return ['Yesterday', 'This week', 'This month', 'Last 3 months', 'Last 6 months', 'This year'];
            return [];
        },
        openDate() {
            return dayjs(this.currentSpan.to).toDate();
        },
        currentSpanHighlight() {
            return {
                from: dayjs(this.currentSpan.from).toDate(),
                to: dayjs(this.currentSpan.to).toDate()
            };
        }
    },
    mounted() {
        const url = new URL(window.location.href);
        if (url.pathname.includes('monthly')) this.$emit('good-news', true);
        if ((this.userStore.user.tier === 'free' && !this.userStore.user.teamStatus) || this.userStore.user.subscriptionType === 'trial') {
            this.filters.splice(0, 0, { text: 'Last week' });
            this.filters.splice(3, 1);
            this.filters.splice(1, 0, { text: 'Last 30 days' });
            this.filters.splice(4, 1);
            this.filters.splice(2, 0, { text: 'Last month' });
            this.filters.splice(6, 1);
        }
        this.$nextTick(() => {
            const dateFilter = this.filter ?? this.filterStore.currentPageFilters?.dateFilter;

            if (dateFilter && dateFilter.dateFrom) {
                this.currentSpan = {
                    from: dayjs(dateFilter.dateFrom).toDate(),
                    to: dayjs(dateFilter.dateTo).toDate()
                };
            }
        });
    },
    methods: {
        handleFilters(e) {
            if (e?.text && !this.optionsDisabled.includes(e?.text)) {
                e.text.includes('Last Month') ? this.setPeriod(this.DATES[e.text], true) : this.setPeriod(this.DATES[e.text], false);
                this.currentFilter = e.text;
            } else this.currentFilter = e;
        },
        disableDate(pickedDate) {
            return dayjs(pickedDate).isBefore(this.filterStore.getDataSpan.dateFrom) || dayjs(pickedDate).add(1, 'day').isAfter(this.filterStore.getDataSpan.dateTo);
        },
        applyFilter() {
            this.$emit('applyFilter');
            this.pickerIsOpen = false;
        },
        dateSelected(d) {
            if (!this.currentSpan.from || this.currentSpan.from >= d || this.currentSpan.to >= d) {
                this.currentSpan.from = dayjs(d).toDate();
                this.currentSpan.to = dayjs(d).toDate();
            } else {
                this.currentSpan.to = dayjs(d).toDate();
            }
            this.emitToParent(this.currentSpan);
        },
        setPeriod(period, isLastMonth) {
            this.$emit('good-news', isLastMonth);
            Object.assign(this.currentSpan, period);
            this.emitToParent(period);
            this.applyFilter();
        },
        formatDate(date) {
            const dateFrom = dayjs(date.from);
            const dateTo = dayjs(date.to);

            if (dateFrom.$D === dateTo.$D && dateFrom.$M === dateTo.$M && dateFrom.$y === dateTo.$y) return `${dateTo.format('MMM DD, YYYY')}`;
            if (dateFrom.$M === dateTo.$M && dateFrom.$y === dateTo.$y) return `${dateFrom.format('MMM DD')} - ${dateTo.format('DD, YYYY')}`;
            if (dateFrom.$y === dateTo.$y) return `${dateFrom.format('MMM DD')} - ${dateTo.format('MMM DD, YYYY')}`;
            return `${dateFrom.format('MMM DD, YYYY')} - ${dateTo.format('MMM DD, YYYY')}`;
        }
    }
};
</script>

<style lang="css">
.calendar.blue .vuejs3-datepicker__calendar-actionarea .prev::after {
    border: solid #2e72f3 !important;
    border-width: 0 2px 2px 0 !important;
}

.calendar.oneDay .vuejs3-datepicker__calendar-actionarea .cell.day.highlighted {
    border-radius: 100% !important;
}
</style>
