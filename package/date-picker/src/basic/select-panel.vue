<template>
    <table cellspacing="0" cellpadding="0" class="select-panel">
        <tbody>
            <tr class="panel-row" v-for="(row, key) in rows" :key="key">
                <td
                    :class="cellClass(cell)"
                    v-for="(cell, keys) in row"
                    :key="keys"
                    @click="clickCell(cell)"
                >
                    {{ cell }}{{ `${panelType === "month" ? "月" : ""}` }}
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default {
    props: {
        yearRange: {
            type: Array,
            default: function () {
                return [];
            },
        },
        panelType: String,
        year: Number,
    },
    data() {
        return {};
    },
    computed: {
        cellClass() {
            return function (cell) {
                return `cell ${parseInt(cell) === this.year ? "current" : ""}`;
            };
        },
        rows() {
            const tableRow = [[], [], []];
            if (this.panelType === "year") {
                let _year = this.yearRange[0] - 1;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 4; j++) {
                        if (i === 2 && j >= 2) {
                            break;
                        }
                        _year = _year + 1;
                        tableRow[i][j] = _year;
                    }
                }
            } else {
                let _month = 0;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 4; j++) {
                        _month = _month + 1;
                        tableRow[i][j] = _month;
                    }
                }
            }
            return tableRow;
        },
    },
    methods: {
        clickCell(cell) {
            if (this.panelType === "year") {
                this.$emit("setYear", cell);
            } else {
                this.$emit("setMonth", cell);
            }
        },
    },
};
</script>

<style lang="less" scoped>
.select-panel {
    table-layout: fixed;
    width: 100%;
    .panel-row {
        td {
            &.cell {
                text-align: center;
                padding: 20px 3px;
                cursor: pointer;
            }
            &.current {
                font-weight: 700;
                color: #409eff;
            }
            &:hover {
                color: #409eff;
            }
        }
    }
}
</style>