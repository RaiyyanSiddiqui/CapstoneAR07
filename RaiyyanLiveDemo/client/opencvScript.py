import cv2 as cv

def chainScript(showImg = False):
    img = cv.imread('liveimage.jpg')
    if(showImg == True):
        cv.imshow('People', img)


    gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    if(showImg == True):
        cv.imshow('Gray People', gray)


    haar_cascade = cv.CascadeClassifier(cv.data.haarcascades + 'haarcascade_frontalface_default.xml')


    faces_rect = haar_cascade.detectMultiScale(
        gray, scaleFactor=1.1, minNeighbors=3)


    print(f'Number of faces found = {len(faces_rect)}')


    for (x, y, w, h) in faces_rect:
        cv.rectangle(img, (x, y), (x+w, y+h), (0, 255, 0), thickness=2)

    if(showImg == True):
        cv.imshow('Detected Faces', img)

    grayWrite = cv.imwrite('gray.png',gray)
    faceModifiedWrite = cv.imwrite('facebox.png', img)

if __name__ == "__main__":
    chainScript(True)
    cv.waitKey(0)