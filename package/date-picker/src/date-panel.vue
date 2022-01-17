<template>
    <collapse-transition>
        <div
            class="picker-panel date-picker popper"
            v-show="visible"
            :style="panelStyle"
        >
            <div class="picker-wrapper">
                <div class="date-picker__header date-picker__header--bordered">
                    <div class="date-picker__header_left">
                        <div
                            class="lanel-btn"
                            @click="setPanelData('prev-year')"
                        >
                            <i class="el-icon-d-arrow-left el-input__icon"></i>
                        </div>
                        <div
                            class="lanel-btn"
                            @click="setPanelData('prev-month')"
                        >
                            <i class="el-icon-arrow-left el-input__icon"></i>
                        </div>
                    </div>
                    <div
                        class="range year-month-panel"
                        v-show="panelType === 'day'"
                    >
                        <span @click="openYearPanel">{{ year }}&nbsp;年</span>
                        <span @click="openMonthPanel"
                            >&nbsp;{{ month }} 月</span
                        >
                    </div>
                    <div class="range year-panel" v-show="panelType === 'year'">
                        <span
                            >{{ yearRange[0] }} 年 &nbsp;-&nbsp;{{
                                yearRange[1]
                            }}年
                        </span>
                    </div>
                    <div
                        class="range month-panel"
                        v-show="panelType === 'month'"
                    >
                        <span @click="openYearPanel">{{ year }}&nbsp;年</span>
                    </div>
                    <div class="date-picker__header_right">
                        <div
                            class="lanel-btn"
                            @click="setPanelData('next-month')"
                        >
                            <i class="el-icon-arrow-right el-input__icon"></i>
                        </div>
                        <div
                            class="lanel-btn"
                            @click="setPanelData('next-year')"
                        >
                            <i class="el-icon-d-arrow-right el-input__icon"></i>
                        </div>
                    </div>
                </div>
                <div class="picker-panel__content">
                    <data-table
                        v-show="panelType === 'day'"
                        :yearRange="yearRange"
                        :year="year"
                        :month="month"
                        :value="value"
                        :panelType="panelType"
                        @changeDay="changeDay"
                    ></data-table>
                    <select-panel
                        v-show="panelType !== 'day'"
                        :yearRange="yearRange"
                        :year="year"
                        :month="month"
                        :panelType="panelType"
                        @setYear="setYear"
                        @setMonth="setMonth"
                    ></select-panel>
                </div>
            </div>
        </div>
    </collapse-transition>
</template>

<script>
import dataTable from "./basic/data-table.vue";
import selectPanel from "./basic/select-panel";
import { collapseTransition } from "desigin-ui/collapse-transition";
export default {
    props: {
        width: {
            type: [Number, String],
            default: 324,
        },
        value: {
            type: [Number, String, Object],
        },
        visible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            panelType: "day",
            yearRange: [],
            year: 0,
            month: 0,
        };
    },
    computed: {
        panelStyle() {
            const { width } = this;
            return `width:${width}px;`;
        },
    },
    components: {
        dataTable,
        selectPanel,
        collapseTransition,
    },
    created() {
        this.setHandlerDate(new Date());
    },
    methods: {
        changeDay(cell) {
            this.$emit("change", cell);
            const { year, month } = cell;
            this.year = year;
            this.month = month;
        },
        openYearPanel() {
            this.panelType = "year";
            const yearStr = this.year.toString();
            const startYear = parseInt(`${yearStr.slice(0, 3)}0`);
            const endYear = startYear + 9;
            this.yearRange = [startYear, endYear];
        },
        openMonthPanel() {
            this.openYearPanel();
            this.panelType = "month";
        },
        setPanelData(mode) {
            let { year, month } = this;
            switch (mode) {
                case "prev-year":
                    year -= 1;
                    break;
                case "next-year":
                    year += 1;
                    break;
                case "prev-month":
                    month = month === 1 ? 12 : month - 1;
                    year -= 1;
                    break;
                case "next-month":
                    month = month === 12 ? 1 : month + 1;
                    year += 1;
                    break;
                default:
            }
            Object.assign(this, { year, month });
        },
        setHandlerDate(date) {
            this.year = date.getFullYear();
            this.month = date.getMonth() + 1;
        },
        setYear(year) {
            this.year = year;
            this.panelType = "month";
        },
        setMonth(month) {
            this.month = month;
            this.panelType = "day";
        },
    },
};
</script>

<style lang="less" scoped>
.picker-panel {
    color: #606266;
    border: 1px solid #e4e7ed;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    background: #fff;
    border-radius: 4px;
    line-height: 30px;
    margin: 12px 0;
    .picker-wrapper {
        .date-picker__header--bordered {
            margin-bottom: 0;
            padding-bottom: 12px;
            border-bottom: 1px solid #ebeef5;
        }
        .date-picker__header {
            margin: 12px;
            text-align: center;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .date-picker__header_left,
            .date-picker__header_right {
                display: flex;
                .lanel-btn {
                    i {
                        &:hover {
                            color: #409eff;
                            cursor: pointer;
                        }
                    }
                }
            }
            .range {
                font-size: 16px;
                font-weight: 500;
                padding: 0 5px;
                line-height: 22px;
                text-align: center;
                cursor: pointer;
                color: #606266;
            }
            .year-month-panel {
                span {
                    &:hover {
                        color: #409eff;
                    }
                }
            }
            .year-panel {
                span {
                    color: #409eff;
                }
            }
        }
        .picker-panel__content {
            margin: 12px auto;
            width: 90%;
        }
    }
}
</style>