import React, { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'
import { useTranslation } from 'react-i18next'

const QrScanner = ({ onScan, onClose }) => {
  const { t } = useTranslation()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    let rafId
    let stream

    const tick = () => {
      if (!active) return
      const video = videoRef.current
      const canvas = canvasRef.current
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)
        if (code?.data) {
          active = false
          onScan(code.data)
          return
        }
      }
      rafId = requestAnimationFrame(tick)
    }

    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'environment' } })
      .then((s) => {
        stream = s
        if (!active) {
          s.getTracks().forEach((track) => track.stop())
          return
        }
        if (videoRef.current) {
          videoRef.current.srcObject = s
          videoRef.current.play()
        }
        tick()
      })
      .catch((err) => setError(err.message))

    return () => {
      active = false
      if (rafId) cancelAnimationFrame(rafId)
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [onScan])

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-4 max-w-sm w-full">
        {error ? (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        ) : (
          <video ref={videoRef} muted playsInline className="w-full rounded-lg bg-black" />
        )}
        <canvas ref={canvasRef} className="hidden" />
        <button
          onClick={onClose}
          className="mt-3 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition text-sm font-semibold"
        >
          {t('common.cancel')}
        </button>
      </div>
    </div>
  )
}

export default QrScanner
