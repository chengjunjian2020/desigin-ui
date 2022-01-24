<template>
    <table cellspacing="0" cellpadding="0" class="data-table">
        <tbody>
            <tr class="week-row">
                <th v-for="week in Weeks" :key="week">{{ week }}</th>
            </tr>
            <tr v-for="(row, key) in rows" :key="key" class="data-table-row">
                <td
                    v-for="cell in row"
                    :key="cell.text"
                    :class="getCellClass(cell)"
                    @click="clickDay(cell)"
                >
                    <div class="cell-day">
                        <span>{{ cell.text }}</span>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import { isSameDay } from "@/utils/date-utils.js";
import dayjs from "dayjs";
export default {
    props: {
        value: [Number, String, Object],
        yearRange: {
            type: Array,
            default: function () {
                return [];
            },
        },
        year: Number,
        month: Number,
        panelType: String,
    },
    data() {
        return {
            tableRows: [[], [], [], [], [], []],
            date: new Date(),
        };
    },
    watch: {
        value(val) {
            if (!val) {
                return;
            }
            if (!dayjs(val).isValid()) {
                console.error("请传入一个有效日期");
                return;
            }
            this.date = new Date(val);
        },
    },
    computed: {
        Weeks() {
            return ["一", "二", "三", "四", "五", "六", "日"];
        },
        getCellClass() {
            return function (cell) {
                return `${cell.type} ${cell.isCurrentDay ? "today" : ""} ${
                    cell.active ? "active" : ""
                }`;
            };
        },
        rows() {
            let tableRow = [[], [], [], [], [], []];
            const { year, month } = this;
            let monthFIrstDay = new Date(`${year}-${month}-01`);
            const week = monthFIrstDay.getDay(); //获取周几
            const intervalDays = week === 0 ? 7 : week;
            const currentDate = new Date();
            let date = dayjs(monthFIrstDay).subtract(intervalDays, "day"); //遍历的开始时间
            for (let i = 0; i < 6; i++) {
                let row = {
                    week: i + 1,
                };
                for (let j = 0; j < 7; j++) {
                    date = date.add(1, "day");
                    const year = parseInt(date.format("YYYY"));
                    const month = parseInt(date.format("MM"));
                    const day = parseInt(date.format("DD"));
                    const _date = date.toDate();
                    let cell = {
                        row,
                        text: day,
                        year,
                        month,
                        day,
                        type: this.getCellType(monthFIrstDay, _date),
                        isCurrentDay: isSameDay(_date, currentDate),
                        active: isSameDay(this.date, date),
                    };
                    tableRow[i][j] = cell;
                }
            }
            return tableRow;
        },
    },
    methods: {
        getCellType(curDate, compareDate) {
            const currentMonth = curDate.getMonth() + 1;
            const compareMonth = compareDate.getMonth() + 1;
            if (currentMonth === compareMonth) {
                return "current";
            } else if (currentMonth + 1 === compareMonth) {
                return "next-month";
            } else {
                return "prev-month";
            }
        },
        clickDay(cell) {
            cell.month = cell.month.toString().padStart(2, "0");
            cell.day = cell.day.toString().padStart(2, "0");
            this.$emit("changeDay", cell);
        },
    },
};
</script>

<style lang="less" scoped>
.data-table {
    width: 100%;
    th {
        padding: 5px;
        color: #606266;
        font-weight: 400;
        border-bottom: 1px solid #ebeef5;
        text-align: center;
    }
    .data-table-row {
        td {
            padding: 4px 0;
            box-sizing: border-box;
            text-align: center;
            cursor: pointer;
            position: relative;
            &.prev-month {
                color: #c0c4cc;
            }
            &.next-month {
                color: #c0c4cc;
            }
            &.today {
                color: #409eff;
                font-weight: 700;
            }

            &:hover {
                color: #409eff;
            }
            &.active {
                display: flex;
                justify-content: center;
                align-items: center;
                .cell-day {
                    width: 24px;
                    line-height: 24px;
                    background: #409eff;
                    border-radius: 50%;
                    color: #fff;
                    transform: translateY(2px);
                }
            }
        }
    }
}
</style>