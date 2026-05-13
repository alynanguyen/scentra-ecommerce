
/** This is the common layout for section headers used across the application.
 * It provides a consistent look for section titles.
 *
 * @param {string} title - The title of the section to be displayed.
 * @returns {string} subtitle - The subtitle of the section to be displayed.
 */

const SectionHeader = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-heading2 font-semibold font-display">{title}</h2>
      {subtitle && <p className="text-caption">{subtitle}</p>}
    </div>
  );
};

export default SectionHeader;

