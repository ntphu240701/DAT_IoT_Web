import React, { useEffect, useRef, useState } from "react";
import "./Control.scss";
import { useIntl } from "react-intl";
import { signal } from "@preact/signals-react";

export const filterProject = signal([]);

export default function Filter(props) {
  const dataLang = useIntl();
  const [warnChecked, setWarnChecked] = useState(false);
  const [noticeChecked, setNoticeChecked] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const opentime = useRef();
  const closetime = useRef();
  const min = useRef(0);
  const max = useRef(0);
  const location = useRef("");
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  const [deviceF, setDeviceF] = useState("all");
  const [pre, setPre] = useState({
    grid: true,
    consumption: true,
    hybrid: true,
    ESS: true,
  });
  const [next, setNext] = useState({
    grid: true,
    consumption: true,
    hybrid: true,
    ESS: true,
  });
  useEffect(() => {
    // mo filter la lay pre
  }, [pre, next]);

  useEffect(() => {
    // mo filter la lay pre
    if (props.display) {
      setNext({
        ...pre,
      });
    }
  }, [props.display]);

  useEffect(() => {
    // nhan luu
    if (props.type == "project") {
      setPre(props.data.elecmode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  const displayFilter = {
    greyFilter: "calc(100vh - 180px)",
    noneheight: "0px",
    plantHeight: "290px",
    deviceHeight: "160px",
    warnHeight: "230px",
  };

  const handleResetWarn = () => {
    setWarnChecked(false);
    setNoticeChecked(false);
    setStartDate("");
    setEndDate("");
  };

  const handleSelect = (e) => {
    if (document.getElementById("warn").checked) {
      props.warn.value = "warn";
      setWarnChecked(true);
    } else {
      document.getElementById("warn").checked = false;
      props.warn.value = {};
      setWarnChecked(false);
    }
    if (document.getElementById("notice").checked) {
      props.notice.value = "notice";
      setNoticeChecked(true);
    } else {
      document.getElementById("notice").checked = false;
      props.notice.value = {};
      setNoticeChecked(false);
    }
  };

  // Thay đổi ngày tháng năm theo lựa chọn trong input placeholder
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const filterdevice = (e) => {
    setDeviceF(e.target.id);
  };

  // Handle close when press ESC
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && props.display) {
        props.handleCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.display]);

  const handleReadPlantMode = (e) => {
    setNext({
      ...next,
      [e.target.id]: e.target.checked,
    });
  };

  return (
    <div
      className="DAT_Filter"
      //   style={{
      //     height: props.display
      //       ? displayFilter.greyFilter
      //       : displayFilter.noneheight,
      //     transition: "0.4s ease-in-out",
      //   }}
    >
      <div
        className="DAT_Filter_Dropdown"
        // style={{
        //   height: props.display
        //     ? displayFilter.plantHeight
        //     : displayFilter.noneheight,
        //   transition: "0.9s",
        // }}
      >
        <div className="DAT_Filter_Dropdown_Item">
          <table className="DAT_Filter_Dropdown_Item_Table">
            {/* <tbody>
              <tr className="DAT_Filter_Dropdown_Item_Table_Tr">
                <th className="DAT_Filter_Dropdown_Item_Table_Tr_Th">
                  {dataLang.formatMessage({ id: "inCapacity" })} (kWp):
                </th>
                <td className="DAT_Filter_Dropdown_Item_Table_Tr_Td">
                  <div className="DAT_Filter_Dropdown_Item_Table_Tr_Td_Checkbox">
                    <input
                      type="number"
                      id="min"
                      ref={min}
                      placeholder={dataLang.formatMessage({
                        id: "minkWp",
                      })}
                      //   defaultValue={props.data.min !== 0 ? props.data.min : ""}
                    />
                    &nbsp; ~ &nbsp;
                    <input
                      type="number"
                      id="max"
                      //   ref={max}
                      placeholder={dataLang.formatMessage({
                        id: "maxkWp",
                      })}
                      //   defaultValue={
                      //     props.data.max !== 1000000000000000
                      //       ? props.data.max
                      //       : ""
                      //   }
                    />
                  </div>
                </td>
              </tr>
            </tbody> */}
            <tbody>
              <tr className="DAT_Filter_Dropdown_Item_Table_Tr">
                <th className="DAT_Filter_Dropdown_Item_Table_Tr_Th">
                  {dataLang.formatMessage({ id: "location" })}:
                </th>
                <td className="DAT_Filter_Dropdown_Item_Table_Tr_Td">
                  <div className="DAT_Filter_Dropdown_Item_Table_Tr_Td_Checkbox">
                    <input
                      type="text"
                      id="location"
                      //   defaultValue={
                      //     props.data.location !== "" ? props.data.location : ""
                      //   }
                      //   ref={location}
                      placeholder={dataLang.formatMessage({
                        id: "enterLocation",
                      })}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
            {/* <tbody>
              <tr className="DAT_Filter_Dropdown_Item_Table_Tr">
                <th className="DAT_Filter_Dropdown_Item_Table_Tr_Th">
                  {dataLang.formatMessage({ id: "plantmode" })}:
                </th>
                <td className="DAT_Filter_Dropdown_Item_Table_Tr_Td">
                  <div className="DAT_Filter_Dropdown_Item_Table_Tr_Td_Checkbox">
                    <input
                      id="grid"
                      type="checkbox"
                      checked={next.grid}
                      onChange={(e) => handleReadPlantMode(e)}
                    />
                    <label htmlFor="grid">
                      {dataLang.formatMessage({ id: "gridType" })}
                    </label>
                  </div>
                  <div className="DAT_Filter_Dropdown_Item_Table_Tr_Td_Checkbox">
                    <input
                      id="consumption"
                      type="checkbox"
                      checked={next.consumption}
                      onChange={(e) => handleReadPlantMode(e)}
                    />
                    <label htmlFor="consumption">
                      {dataLang.formatMessage({
                        id: "consumptionType",
                      })}
                    </label>
                  </div>
                  <div className="DAT_Filter_Dropdown_Item_Table_Tr_Td_Checkbox">
                    <input
                      id="hybrid"
                      type="checkbox"
                      checked={next.hybrid}
                      onChange={(e) => handleReadPlantMode(e)}
                    />
                    <label htmlFor="hybrid">
                      {dataLang.formatMessage({ id: "hybridType" })}
                    </label>
                  </div>
                  <div className="DAT_Filter_Dropdown_Item_Table_Tr_Td_Checkbox">
                    <input
                      id="ESS"
                      type="checkbox"
                      checked={next.ESS}
                      onChange={(e) => handleReadPlantMode(e)}
                    />
                    <label htmlFor="ESS">
                      {dataLang.formatMessage({ id: "ESS" })}
                    </label>
                  </div>
                </td>
              </tr>
            </tbody> */}
          </table>
        </div>

        <div className="DAT_Filter_Dropdown_Bot">
          <button
            style={{ backgroundColor: "white", color: "black" }}
            onClick={() => props.handleCancel()}
          >
            {dataLang.formatMessage({ id: "cancel" })}
          </button>
          <button
            style={{ backgroundColor: "white", color: "black" }}
            onClick={(e) => {
              props.handleReset();
            }}
          >
            {dataLang.formatMessage({ id: "reset" })}
          </button>
          <button
            style={{
              backgroundColor: "#0B1967",
              color: "white",
            }}
            onClick={() =>
              props.handleClose(
                min.current.value,
                max.current.value,
                location.current.value,
                next
              )
            }
          >
            {dataLang.formatMessage({ id: "confirm" })}
          </button>
        </div>
      </div>
    </div>
  );
}
