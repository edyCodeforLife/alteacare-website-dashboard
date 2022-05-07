import moment from 'moment';
import { forwardRef } from 'react';
import { Api } from '../../helpers/api';
import { ButtonDarkGrey } from '../atoms';
import LoadingComponent from './loader/LoadingComponent';
import { LocalStorage } from '../../helpers/localStorage';
import { DatePicker, React, useEffect, useState } from '../../libraries';
import { AlertMessagePanel } from '../../components/molecules/modal';
import {
  CheckBox,
  UncheckBox,
  EmptyMedical,
  RefreshIcon,
  AlertcloseBlue,
} from '../../assets/images';

const MedicalResume = ({ heightContent, counterClose, appointmentId }) => {
  const [medical, setMedical] = useState(null);
  const [checked, setChecked] = useState(false);
  const [fromRefresh, setFromRefresh] = useState(false);
  const [refreshState, setRefreshState] = useState(false);
  const [sectionContentHeight, setSectionContentHeight] = useState(0);
  const [messageAlert, setMessageAlert] = useState(null);
  const [enableVoucher, setEnableVoucher] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherDateStart, setVoucherDateStart] = useState(null);
  const [voucherDateEnd, setVoucherDateEnd] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const headerHeight = document.getElementById('header').clientHeight;
    setSectionContentHeight(parseInt(heightContent) - parseInt(headerHeight));
  }, [heightContent]);

  useEffect(() => {
    Api.get(`appointment/detail/${appointmentId}`, {
      headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
    })
      .then(response => {
        if (response.data.data.medical_resume) {
          setMedical(response.data.data.medical_resume);
        }
      })
      .catch(error => {
        setMedical(null);
      });
  }, [appointmentId]);

  const refresh = appointmentId => {
    setRefreshState(true);

    // const footerHeight = document.getElementById('footer-prosess').clientHeight
    const footerHeight = 44;
    setSectionContentHeight(
      parseInt(sectionContentHeight) - parseInt(footerHeight)
    );

    Api.get(`appointment/detail/${appointmentId}/medical-resume`, {
      headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
    })
      .then(response => {
        setFromRefresh(true);
        setRefreshState(false);
        setMedical(response.data.data);
      })
      .catch(error => {
        setMedical(null);
        setRefreshState(false);
      });
  };

  const approve = appointmentId => {
    if (enableVoucher) {
      if (!voucherCode) {
        setMessageAlert({
          text: 'Kode Voucher tidak boleh kosong',
          type: 'failed',
          direction: 'bottom',
        });

        return;
      }

      if (!voucherDateStart || !voucherDateEnd) {
        setMessageAlert({
          text: 'Masa Berlaku tidak boleh kosong',
          type: 'failed',
          direction: 'bottom',
        });

        return;
      }
    }

    const params = {};

    if (enableVoucher) {
      params.voucher_code = voucherCode;
      params.daterange = `${moment(voucherDateStart).format(
        'DD/MM/YYYY'
      )} - ${moment(voucherDateEnd).format('DD/MM/YYYY')}`;
    }
    setIsLoading(true);
    Api.get(
      `appointment/detail/${appointmentId}/medical-resume/${medical.id}/approve`,
      {
        headers: { Authorization: `Bearer ${LocalStorage('access_token')}` },
        params,
      }
    )
      .then(response => {
        setIsLoading(false);
        setFromRefresh(false);
        setMessageAlert({
          text: 'Medical resume telah berhasil dicek',
          type: 'success',
          direction: 'top',
        });
      })
      .catch(error => {
        setIsLoading(false);
        setMessageAlert({
          text: error.response.data.message,
          type: 'failed',
          direction: 'bottom',
        });
      });
  };

  const onChange = dates => {
    const [start, end] = dates;
    setVoucherDateStart(start);
    setVoucherDateEnd(end);
  };

  const DateRangeCustomInput = forwardRef(({ onClick }, ref) => (
    <input
      onClick={onClick}
      disabled={!enableVoucher}
      tabindex="-1"
      value={
        voucherDateStart && voucherDateEnd
          ? `${moment(voucherDateStart).format('DD/MM/YYYY')} - ${moment(
              voucherDateEnd
            ).format('DD/MM/YYYY')}`
          : ''
      }
    />
  ));

  return (
    <div
      className="fixed w-full h-full inset-0 z-10"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div
        className="w-2/6 flex flex-wrap items-start h-full absolute right-0 bottom-0 bg-white"
        style={{ height: `${heightContent}px` }}
      >
        <div
          id="header"
          className="w-full bg-light3 flex flex-wrap justify-between py-2 px-6"
        >
          <div className="text-dark2 font-bold text-lg">Memo Altea</div>
          <div className="text-info2 flex items-center justify-end">
            {!medical && (
              <button
                className="flex justify-end"
                onClick={() => refresh(appointmentId)}
              >
                <img
                  src={RefreshIcon}
                  alt="Refresh Icon"
                  className="inline mr-2"
                />{' '}
                Refresh
              </button>
            )}
            <img
              src={AlertcloseBlue}
              alt="close"
              className="inline ml-4 cursor-pointer"
              onClick={() => counterClose(false)}
            />
          </div>
        </div>
        <div className="w-full">
          {medical && !refreshState && (
            <div
              className="overflow-y-scroll small-scroll"
              style={{ height: `${sectionContentHeight}px` }}
            >
              <div className="w-full px-6 py-2">
                <p className="text-sm font-bold mb-2">Keluhan</p>
                <p
                  className="text-xs whitespace-pre-line"
                  style={{ color: '#6B7588' }}
                >
                  {medical.symptom}
                </p>
              </div>
              <div className="w-full px-6 py-2">
                <p className="text-sm font-bold mb-2">Diagnosis</p>
                <p
                  className="text-xs whitespace-pre-line"
                  style={{ color: '#6B7588' }}
                >
                  {medical.diagnosis}
                </p>
              </div>
              <div className="w-full px-6 py-2">
                <p className="text-sm font-bold mb-2">Obat</p>
                <p
                  className="text-xs whitespace-pre-line"
                  style={{ color: '#6B7588' }}
                >
                  {medical.drug_resume}
                </p>
              </div>
              <div className="w-full px-6 py-2">
                <p className="text-sm font-bold mb-2">Pemeriksaan Penunjang</p>
                <p
                  className="text-xs whitespace-pre-line"
                  style={{ color: '#6B7588' }}
                >
                  {medical.additional_resume}
                </p>
              </div>
              <div className="w-full px-6 py-2">
                <p className="text-sm font-bold mb-2">Konsultasi</p>
                <p
                  className="text-xs whitespace-pre-line"
                  style={{ color: '#6B7588' }}
                >
                  {medical.consultation}
                </p>
              </div>
              <div className="w-full px-6 py-2">
                <p className="text-sm font-bold mb-2">Catatan Lain</p>
                <p
                  className="text-xs whitespace-pre-line"
                  style={{ color: '#6B7588' }}
                >
                  {medical.notes}
                </p>
              </div>
              <div className="w-full px-6 py-2">
                <p className="text-sm font-bold mb-2">Surat Pengantar</p>
                <p className="text-xs" style={{ color: '#6B7588' }}>
                  {medical.files.length > 0 &&
                    medical.files.map(item => (
                      <div key={item.id}>
                        <a href={item.url} target="_blank" rel="noreferrer">
                          {item.name}
                        </a>
                        <br />
                      </div>
                    ))}
                </p>
              </div>
              {fromRefresh && (
                <div className="w-full px-6 py-2 mt-2">
                  <div
                    className="flex cursor-pointer mt-2 items-center"
                    onClick={() => {
                      setEnableVoucher(!enableVoucher);
                      setVoucherCode('');
                      setVoucherDateStart(null);
                      setVoucherDateEnd(null);
                    }}
                  >
                    <img
                      src={enableVoucher ? CheckBox : UncheckBox}
                      alt="Check Box"
                      className="w-4 h-4 mr-2"
                    />
                    <span className="flex flex-1 text-xs">
                      Sematkan voucher pada surat pengantar
                    </span>
                  </div>
                  <div
                    className={`mt-2 wrap-form-edit${
                      enableVoucher ? '' : '-disabled'
                    }`}
                  >
                    <p>Kode Voucher</p>
                    <input
                      type="text"
                      value={voucherCode}
                      disabled={!enableVoucher}
                      onChange={event => setVoucherCode(event.target.value)}
                    />
                  </div>
                  <div
                    className={`mt-1 mb-12 wrap-form-edit${
                      enableVoucher ? '' : '-disabled'
                    }`}
                  >
                    <p>Masa Berlaku</p>
                    <DatePicker
                      wrapperClassName="w-full"
                      minDate={new Date()}
                      disabled={!enableVoucher}
                      selected={voucherDateStart}
                      onChange={onChange}
                      startDate={voucherDateStart}
                      endDate={voucherDateEnd}
                      selectsRange
                      monthsShown={1}
                      shouldCloseOnSelect={false}
                      customInput={<DateRangeCustomInput />}
                    />
                    <div></div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div id="footer-prosess" className={`w-full`}>
            {medical && fromRefresh && !refreshState && (
              <div className="w-full px-5 py-2 flex items-center">
                <div
                  className="mr-auto text-sm cursor-pointer"
                  style={{ color: '#6B7588' }}
                  onClick={() => setChecked(!checked)}
                >
                  <img
                    src={checked ? CheckBox : UncheckBox}
                    alt="Uncheck Box"
                    className="inline mr-2"
                  />
                  Check Memo Altea
                </div>
                <ButtonDarkGrey
                  text="Done"
                  dimension="ml-auto"
                  counter={checked ? () => approve(appointmentId) : () => {}}
                  style={{
                    cursor: checked ? '' : 'not-allowed',
                    backgroundColor: checked ? '' : '#c7c9d9',
                  }}
                />
              </div>
            )}
          </div>
          {!medical && !refreshState && (
            <div
              className="flex flex-wrap justify-center items-center"
              style={{ height: `${heightContent}px` }}
            >
              <div className="flex flex-wrap justify-center">
                <img alt="empty" src={EmptyMedical} />
                <p className="w-full text-center py-2 text-dark4">
                  Belum ada medical resume
                </p>
              </div>
            </div>
          )}
          {isLoading && (
            <div
              style={{ height: `${heightContent}px` }}
              className="flex flex-wrap absolute bottom-0 w-full bg-dark1 opacity-75"
            >
              <LoadingComponent />
            </div>
          )}
          {refreshState && (
            <div
              style={{ height: `${sectionContentHeight}px` }}
              className="flex flex-wrap absolute z-10 bottom-0 w-full bg-white"
            >
              <LoadingComponent />
            </div>
          )}
          {messageAlert !== null && (
            <AlertMessagePanel
              text={messageAlert.text}
              type={messageAlert.type}
              direction={messageAlert.direction}
              counter={value => setMessageAlert(value)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

MedicalResume.defaultProps = {
  withoutHeightHeader: false,
  heightContent: 0,
};

export default MedicalResume;
