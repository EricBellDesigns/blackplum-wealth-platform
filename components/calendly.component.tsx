import {useEffect} from "react";

export default function CalendlyComponent() {
  useEffect(() => {
    const head = document.querySelector("head");
    const script = document.createElement("script");
    script.setAttribute("src", "https://assets.calendly.com/assets/external/widget.js");
    head.appendChild(script);
  }, []);

  return (
    <div>
      <div id="schedule_form">
        <div
          className="calendly-inline-widget"
          data-url="https://calendly.com/thomas-humbledevs/30min"
          style={{minWidth: "320px", height: "700px"}}/>
      </div>
    </div>
  );
}
