import styles from "./style.module.css";

function Stats(props) {
    return (
        <>
            <div className={styles.stats}>
                <ul>
                    {/* <li>Mean: {stats.voltage.measure.mean.toFixed(2)}</li>
                    <li>Median: {stats.voltage.measure.median.toFixed(2)}</li>
                    <li>Std: {stats.voltage.measure.std.toFixed(2)}</li> */}
                    <li>Mean: {props.stat.measure.mean.toFixed(2)}</li>
                    <li>Median: {props.stat.measure.median.toFixed(2)}</li>
                    <li>Std: {props.stat.measure.std.toFixed(2)}</li>
                </ul>
            </div>
        </>
    )
}

export default Stats;