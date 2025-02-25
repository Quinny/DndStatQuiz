gsutil cp app.jsx index.html style.css "gs://quinnftw.com/dnd/"
gsutil acl ch -r -u AllUsers:R "gs://quinnftw.com/dnd"
